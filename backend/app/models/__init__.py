from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class Transaction:
    id: str
    user_id: str
    date: str
    description: str
    type: str  # "income" or "expense"
    amount: float
    category: str = "other"
    balance: Optional[float] = None
    source: str = "csv"
    created_at: str = field(default_factory=lambda: datetime.utcnow().isoformat())

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "date": self.date,
            "description": self.description,
            "type": self.type,
            "amount": self.amount,
            "category": self.category,
            "balance": self.balance,
            "source": self.source,
            "created_at": self.created_at,
        }
