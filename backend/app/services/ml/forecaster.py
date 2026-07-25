import pandas as pd
import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression


class CrimeForecaster:
    def __init__(self):
        self.model = None
        self.poly = PolynomialFeatures(degree=3)
        self.last_t = 0

    def fit(self, df: pd.DataFrame):
        df = df.copy()
        df["ds"] = pd.to_datetime(df["ds"])
        t_values = (df["ds"] - df["ds"].min()).dt.days.values
        self.last_t = int(t_values.max()) if len(t_values) > 0 else 0
        X_poly = self.poly.fit_transform(t_values.reshape(-1, 1))
        self.model = LinearRegression()
        self.model.fit(X_poly, df["y"].values)

    def predict(self, periods: int):
        if self.model is None:
            return pd.DataFrame()
        start_t = self.last_t + 1
        future_t = np.arange(start_t, start_t + periods).reshape(-1, 1)
        X_future = self.poly.transform(future_t)
        yhat = self.model.predict(X_future)
        residuals = np.maximum(0.05 * np.abs(yhat), 0.1)
        return pd.DataFrame({
            "yhat": np.maximum(0, yhat),
            "yhat_lower": np.maximum(0, yhat - residuals),
            "yhat_upper": yhat + residuals,
        })
