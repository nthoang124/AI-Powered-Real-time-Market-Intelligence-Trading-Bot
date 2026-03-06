import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

class SentimentAnalyzer:
    def __init__(self):
        # We use a PhoBERT based model for Vietnamese/English financial context
        # For this MVP, we are using the base model. In production, this would be a fine-tuned model.
        self.model_name = "vinai/phobert-base-v2"
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        # Using num_labels=3 (Negative, Neutral, Positive)
        self.model = AutoModelForSequenceClassification.from_pretrained(
            self.model_name, num_labels=3
        )
        self.model.eval()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model.to(self.device)

    def analyze(self, texts: list[str]) -> dict:
        if not texts:
            return {
                "market_sentiment": 50.0,
                "label": "Neutral",
                "details": []
            }

        # Tokenize and run model
        inputs = self.tokenizer(texts, return_tensors="pt",
                                padding=True, truncation=True, max_length=256)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = self.model(**inputs)
            probs = torch.softmax(outputs.logits, dim=-1)

        # Assuming labels mapping: 0: Negative, 1: Neutral, 2: Positive
        # Calculate a weighted sentiment score (0-100)
        # 0*Negative + 50*Neutral + 100*Positive = Score
        batch_scores = probs[:, 1] * 50 + probs[:, 2] * 100
        
        market_sentiment = batch_scores.mean().item()

        return {
            "market_sentiment": round(market_sentiment, 2),
            "label": "Bullish" if market_sentiment > 60 else "Bearish" if market_sentiment < 40 else "Neutral",
            "details": [
                {
                    "text": t,
                    "negative": round(p[0].item(), 4),
                    "neutral": round(p[1].item(), 4),
                    "positive": round(p[2].item(), 4)
                }
                for t, p in zip(texts, probs)
            ]
        }
