import unittest
from sklearn.metrics import cohen_kappa_score
from backend.agreement import cohen_kappa, fleiss_kappa, kappa_to_text

class TestKappaFunctions(unittest.TestCase):
    
    # Test for cohen_kappa
    def test_cohen_kappa(self):
        # Test with a simple agreement scenario
        annotator1 = [1, 2, 3, 4]
        annotator2 = [1, 2, 3, 4]
        expected_kappa = cohen_kappa_score(annotator1, annotator2)
        self.assertEqual(cohen_kappa(annotator1, annotator2), expected_kappa)

        # Test with a scenario of disagreement
        annotator1 = [1, 2, 3, 4]
        annotator2 = [4, 3, 2, 1]
        expected_kappa = cohen_kappa_score(annotator1, annotator2)
        self.assertEqual(cohen_kappa(annotator1, annotator2), expected_kappa)

        # Test with unequal lengths (should raise ValueError)
        annotator1 = [1, 2, 3]
        annotator2 = [1, 2]
        with self.assertRaises(ValueError):
            cohen_kappa(annotator1, annotator2)
    
    # Test for fleiss_kappa
    def test_fleiss_kappa(self):
        # Valid matrix with 3 raters and 2 categories
        # from https://datatab.net/tutorial/fleiss-kappa
        matrix = [
            [0, 3],
            [1, 2],
            [3, 0],
            [1, 2],
            [0, 3],
            [2, 1],
            [1, 2],
        ]
        expected_kappa = 0.19  # Example kappa score for this case
        self.assertAlmostEqual(fleiss_kappa(matrix), expected_kappa, places=2)

        # Test with inconsistent rater count (should raise ValueError)
        invalid_matrix = [
            [2, 1],
            [0, 3],
            [1, 1]  # Invalid, sum is 2 while others are 3
        ]
        with self.assertRaises(ValueError):
            fleiss_kappa(invalid_matrix)

        # Edge case: Perfect agreement
        matrix_perfect =[
            [3, 0],
            [0, 3],
            [3, 0]
        ]
        self.assertEqual(fleiss_kappa(matrix_perfect), 1.0)

        # Edge case: Complete disagreement
        matrix_disagreement =[
            [1, 2],
            [2, 1],
            [1, 2]
        ]
        self.assertAlmostEqual(fleiss_kappa(matrix_disagreement), -0.35, places=2)

    # Test for kappa_to_text
    def test_kappa_to_text(self):
        # Test for various kappa values
        self.assertEqual(kappa_to_text(0.15), "Slight agreement")
        self.assertEqual(kappa_to_text(0.35), "Fair agreement")
        self.assertEqual(kappa_to_text(0.55), "Moderate agreement")
        self.assertEqual(kappa_to_text(0.75), "Substantial agreement")
        self.assertEqual(kappa_to_text(0.95), "Almost perfect agreement")
        self.assertEqual(kappa_to_text(-0.1), "Poor agreement")

        # Test for edge cases
        self.assertEqual(kappa_to_text(1.0), "Almost perfect agreement")
        self.assertEqual(kappa_to_text(0.0), "Slight agreement")
        self.assertEqual(kappa_to_text(-1), "Poor agreement")
        self.assertEqual(kappa_to_text(1.5), "Invalid Kappa value")

