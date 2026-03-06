"""market_prices_hypertable

Revision ID: 08e8af621593
Revises: b98b0ca63886
Create Date: 2026-03-07 02:17:43.754577

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '08e8af621593'
down_revision: Union[str, Sequence[str], None] = 'b98b0ca63886'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create schema and pg_partman extension
    op.execute("CREATE SCHEMA IF NOT EXISTS partman;")
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_partman SCHEMA partman;")
    
    # 2. Create the market_prices table partitioned by time range
    op.execute("""
    CREATE TABLE market_prices (
        time        TIMESTAMPTZ NOT NULL,
        symbol      TEXT NOT NULL,
        open        DOUBLE PRECISION,
        high        DOUBLE PRECISION,
        low         DOUBLE PRECISION,
        close       DOUBLE PRECISION,
        volume      DOUBLE PRECISION,
        PRIMARY KEY (time, symbol)
    ) PARTITION BY RANGE (time);
    """)
    
    # 3. Initialize pg_partman on the table
    op.execute("""
    SELECT partman.create_parent(
        p_parent_table := 'public.market_prices',
        p_control := 'time',
        p_type := 'native',
        p_interval := '1 day',
        p_premake := 7
    );
    """)

def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS public.market_prices CASCADE;")
