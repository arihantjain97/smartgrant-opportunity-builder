import unittest
from typing import Any, Dict, List

MetricConfig = Dict[str, Any]

METRIC_CONFIG: List[MetricConfig] = [
    {"label": "Revenue Lift", "key": "revenueLiftPct", "better": "higher"},
    {"label": "New Leads / mo", "key": "leadDeltaPerMonth", "better": "higher"},
    {"label": "CAC Change", "key": "cacChangePct", "better": "lower"},
    {"label": "Time to First Lead", "key": "timeToFirstLeadWeeks", "better": "lower"},
]

DEFAULT_TIME_WEIGHT = 20
TOLERANCE = 1e-4


def _is_number(value: Any) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def compute_winners(options: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    if len(options) <= 1:
        return {}

    winners: Dict[str, Dict[str, Any]] = {}
    for metric in METRIC_CONFIG:
        entries = []
        for option in options:
            impact = option.get("businessImpact", {})
            value = impact.get(metric["key"])
            if _is_number(value):
                entries.append({"id": option.get("id"), "value": float(value)})

        if not entries:
            continue

        if metric["better"] == "higher":
            best_value = max(entry["value"] for entry in entries)
        else:
            best_value = min(entry["value"] for entry in entries)

        winner_ids = [
            entry["id"]
            for entry in entries
            if abs(entry["value"] - best_value) <= TOLERANCE
        ]

        if winner_ids:
            winners[metric["label"]] = {
                "label": metric["label"],
                "bestValue": best_value,
                "winnerIds": winner_ids,
            }

    return winners


def compute_score(option: Dict[str, Any]) -> float:
    impact = option.get("businessImpact", {}) or {}

    revenue = impact.get("revenueLiftPct")
    leads = impact.get("leadDeltaPerMonth")
    cac = impact.get("cacChangePct")
    time_to_lead = impact.get("timeToFirstLeadWeeks")

    revenue_component = float(revenue) if _is_number(revenue) else 0.0
    leads_component = float(leads) if _is_number(leads) else 0.0
    cac_component = -float(cac) if _is_number(cac) else 0.0  # lower CAC is better
    time_component = (
        DEFAULT_TIME_WEIGHT - float(time_to_lead)
        if _is_number(time_to_lead)
        else 0.0
    )

    return (
        revenue_component * 1.5
        + leads_component * 1.2
        + cac_component * 1.1
        + time_component * 0.8
    )


class WinnerLogicTests(unittest.TestCase):
    def test_revenue_lift_winner(self) -> None:
        solutions = [
            {"id": "a", "businessImpact": {"revenueLiftPct": 10}},
            {"id": "b", "businessImpact": {"revenueLiftPct": 15}},
            {"id": "c", "businessImpact": {"revenueLiftPct": 9}},
        ]
        winners = compute_winners(solutions)
        self.assertEqual(winners["Revenue Lift"]["winnerIds"], ["b"])

    def test_time_to_first_lead_winner(self) -> None:
        solutions = [
            {"id": "a", "businessImpact": {"timeToFirstLeadWeeks": 3}},
            {"id": "b", "businessImpact": {"timeToFirstLeadWeeks": 6}},
            {"id": "c", "businessImpact": {"timeToFirstLeadWeeks": 5}},
        ]
        winners = compute_winners(solutions)
        self.assertEqual(winners["Time to First Lead"]["winnerIds"], ["a"])

    def test_cac_change_winner_uses_lowest_value(self) -> None:
        solutions = [
            {"id": "a", "businessImpact": {"cacChangePct": -12}},
            {"id": "b", "businessImpact": {"cacChangePct": -8}},
            {"id": "c", "businessImpact": {"cacChangePct": -10}},
        ]
        winners = compute_winners(solutions)
        self.assertEqual(winners["CAC Change"]["winnerIds"], ["a"])

    def test_ties_produce_multiple_winners(self) -> None:
        solutions = [
            {"id": "a", "businessImpact": {"revenueLiftPct": 10}},
            {"id": "b", "businessImpact": {"revenueLiftPct": 10}},
            {"id": "c", "businessImpact": {"revenueLiftPct": 5}},
        ]
        winners = compute_winners(solutions)
        self.assertCountEqual(winners["Revenue Lift"]["winnerIds"], ["a", "b"])

    def test_missing_metric_data_is_safe(self) -> None:
        solutions = [
            {"id": "a", "businessImpact": {"revenueLiftPct": 12}},
            {"id": "b", "businessImpact": {}},  # missing metric
            {"id": "c", "businessImpact": {"revenueLiftPct": None}},
        ]
        winners = compute_winners(solutions)
        self.assertEqual(winners["Revenue Lift"]["winnerIds"], ["a"])

    def test_overall_score_is_monotonic(self) -> None:
        base_solution = {
            "id": "base",
            "businessImpact": {
                "revenueLiftPct": 10,
                "leadDeltaPerMonth": 20,
                "cacChangePct": -5,
                "timeToFirstLeadWeeks": 6,
            },
        }
        better_solution = {
            "id": "better",
            "businessImpact": {
                "revenueLiftPct": 12,  # higher
                "leadDeltaPerMonth": 25,  # higher
                "cacChangePct": -7,  # lower (better)
                "timeToFirstLeadWeeks": 4,  # lower (faster)
            },
        }
        equal_solution = {
            "id": "copy",
            "businessImpact": {
                "revenueLiftPct": 10,
                "leadDeltaPerMonth": 20,
                "cacChangePct": -5,
                "timeToFirstLeadWeeks": 6,
            },
        }

        base_score = compute_score(base_solution)
        better_score = compute_score(better_solution)
        equal_score = compute_score(equal_solution)

        self.assertGreater(better_score, base_score)
        self.assertAlmostEqual(base_score, equal_score, places=5)


if __name__ == "__main__":
    unittest.main()

