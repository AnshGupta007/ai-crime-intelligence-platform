import pandas as pd
try:
    from prophet import Prophet
    HAS_PROPHET = True
except ImportError:
    HAS_PROPHET = False
    from sklearn.preprocessing import PolynomialFeatures
    from sklearn.linear_model import LinearRegression
    import numpy as np


class CrimeForecaster:
    def __init__(self):
        self.model = None

    def fit(self, df: pd.DataFrame):
        df = df.copy()
        df["ds"] = pd.to_datetime(df["ds"])

        if HAS_PROPHET:
            self.model = Prophet(
                yearly_seasonality=True,
                weekly_seasonality=True,
                daily_seasonality=False,
                seasonality_mode="multiplicative",
                interval_width=0.95,
            )
            holidays = pd.DataFrame({
                "ds": pd.to_datetime([
                    "2025-01-15", "2025-01-26", "2025-03-14", "2025-04-10",
                    "2025-08-15", "2025-10-02", "2025-10-20", "2025-11-01",
                    "2025-12-25", "2026-01-15", "2026-01-26",
                ]),
                "holiday": [
                    "festival", "republic_day", "festival", "festival",
                    "independence", "gandhi_jayanti", "festival", "kannada_rajyotsava",
                    "christmas", "festival", "republic_day"
                ],
                "lower_window": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "upper_window": [1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0],
            })
            try:
                self.model.add_country_holidays(country_name="IN")
            except Exception:
                pass
            self.model.fit(df)
        else:
            self.poly = PolynomialFeatures(degree=3)
            t_values = (df["ds"] - df["ds"].min()).dt.days.values
            self.last_t = int(t_values.max()) if len(t_values) > 0 else 0
            X_poly = self.poly.fit_transform(t_values.reshape(-1, 1))
            self.model = LinearRegression()
            self.model.fit(X_poly, df["y"].values)

    def predict(self, periods: int):
        if self.model is None:
            return pd.DataFrame()

        if HAS_PROPHET:
            future = self.model.make_future_dataframe(periods=periods)
            forecast = self.model.predict(future)
            last_n = forecast.tail(periods)
            return pd.DataFrame({
                "yhat": last_n["yhat"].values,
                "yhat_lower": last_n["yhat_lower"].values,
                "yhat_upper": last_n["yhat_upper"].values,
            })
        else:
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

    def get_components(self, df: pd.DataFrame):
        if self.model is None or not HAS_PROPHET:
            return {}
        forecast = self.model.predict(df)
        return {
            "trend": forecast["trend"].tolist(),
            "weekly": forecast["weekly"].tolist(),
            "yearly": forecast["yearly"].tolist(),
        }
