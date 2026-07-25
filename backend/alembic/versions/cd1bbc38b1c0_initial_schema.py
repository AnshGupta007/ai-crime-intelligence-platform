"""initial_schema

Revision ID: cd1bbc38b1c0
Revises:
Create Date: 2026-07-22 22:45:29.134064

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'cd1bbc38b1c0'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- Lookup / Reference Tables ---

    op.create_table('nationalities',
        sa.Column('nationality_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('nationality_name', sa.String(length=100), nullable=True),
        sa.PrimaryKeyConstraint('nationality_id')
    )

    op.create_table('states',
        sa.Column('state_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('state_name', sa.String(length=100), nullable=True),
        sa.Column('nationality_id', sa.Integer(), nullable=True),
        sa.Column('active', sa.Boolean(), nullable=True, server_default=sa.text('1')),
        sa.PrimaryKeyConstraint('state_id')
    )

    op.create_table('districts',
        sa.Column('district_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('district_name', sa.String(length=100), nullable=True),
        sa.Column('state_id', sa.Integer(), nullable=True),
        sa.Column('active', sa.Boolean(), nullable=True, server_default=sa.text('1')),
        sa.Column('boundary_geojson', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['state_id'], ['states.state_id'], ),
        sa.PrimaryKeyConstraint('district_id')
    )

    op.create_table('unit_types',
        sa.Column('unit_type_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('type_name', sa.String(length=100), nullable=True),
        sa.PrimaryKeyConstraint('unit_type_id')
    )

    op.create_table('units',
        sa.Column('unit_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('unit_name', sa.String(length=255), nullable=True),
        sa.Column('type_id', sa.Integer(), nullable=True),
        sa.Column('parent_unit', sa.Integer(), nullable=True),
        sa.Column('state_id', sa.Integer(), nullable=True),
        sa.Column('district_id', sa.Integer(), nullable=True),
        sa.Column('active', sa.Boolean(), nullable=True, server_default=sa.text('1')),
        sa.Column('latitude', sa.DECIMAL(10, 8), nullable=True),
        sa.Column('longitude', sa.DECIMAL(11, 8), nullable=True),
        sa.ForeignKeyConstraint(['district_id'], ['districts.district_id'], ),
        sa.ForeignKeyConstraint(['parent_unit'], ['units.unit_id'], ),
        sa.ForeignKeyConstraint(['state_id'], ['states.state_id'], ),
        sa.ForeignKeyConstraint(['type_id'], ['unit_types.unit_type_id'], ),
        sa.PrimaryKeyConstraint('unit_id')
    )

    op.create_table('crime_heads',
        sa.Column('crime_head_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('crime_head_name', sa.String(length=255), nullable=True),
        sa.Column('crime_group_name', sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint('crime_head_id')
    )

    op.create_table('crime_sub_heads',
        sa.Column('crime_sub_head_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('sub_head_name', sa.String(length=255), nullable=True),
        sa.Column('crime_head_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['crime_head_id'], ['crime_heads.crime_head_id'], ),
        sa.PrimaryKeyConstraint('crime_sub_head_id')
    )

    op.create_table('case_categories',
        sa.Column('case_category_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('category_name', sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint('case_category_id')
    )

    op.create_table('gravity_offences',
        sa.Column('gravity_offence_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('offence_name', sa.String(length=255), nullable=True),
        sa.Column('gravity_level', sa.String(length=50), nullable=True),
        sa.PrimaryKeyConstraint('gravity_offence_id')
    )

    op.create_table('case_status_masters',
        sa.Column('case_status_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('case_status_name', sa.String(length=100), nullable=True),
        sa.PrimaryKeyConstraint('case_status_id')
    )

    op.create_table('courts',
        sa.Column('court_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('court_name', sa.String(length=255), nullable=True),
        sa.Column('district_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['district_id'], ['districts.district_id'], ),
        sa.PrimaryKeyConstraint('court_id')
    )

    op.create_table('employees',
        sa.Column('employee_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('employee_name', sa.String(length=255), nullable=True),
        sa.Column('designation', sa.String(length=100), nullable=True),
        sa.Column('unit_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['unit_id'], ['units.unit_id'], ),
        sa.PrimaryKeyConstraint('employee_id')
    )

    # --- Persons / Actors ---

    op.create_table('users',
        sa.Column('user_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('username', sa.String(length=100), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=20), nullable=False),
        sa.Column('district_id', sa.Integer(), nullable=True),
        sa.Column('station_id', sa.Integer(), nullable=True),
        sa.Column('employee_id', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('NOW()')),
        sa.PrimaryKeyConstraint('user_id'),
        sa.UniqueConstraint('username')
    )

    op.create_table('case_masters',
        sa.Column('case_master_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('crime_no', sa.String(length=25), nullable=False),
        sa.Column('case_no', sa.String(length=15), nullable=False),
        sa.Column('crime_registered_date', sa.Date(), nullable=False),
        sa.Column('police_person_id', sa.Integer(), nullable=True),
        sa.Column('police_station_id', sa.Integer(), nullable=True),
        sa.Column('case_category_id', sa.Integer(), nullable=True),
        sa.Column('gravity_offence_id', sa.Integer(), nullable=True),
        sa.Column('crime_major_head_id', sa.Integer(), nullable=True),
        sa.Column('crime_minor_head_id', sa.Integer(), nullable=True),
        sa.Column('case_status_id', sa.Integer(), nullable=True),
        sa.Column('court_id', sa.Integer(), nullable=True),
        sa.Column('incident_from_date', sa.DateTime(), nullable=True),
        sa.Column('incident_to_date', sa.DateTime(), nullable=True),
        sa.Column('info_received_ps_date', sa.DateTime(), nullable=True),
        sa.Column('latitude', sa.DECIMAL(10, 8), nullable=True),
        sa.Column('longitude', sa.DECIMAL(11, 8), nullable=True),
        sa.Column('brief_facts', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('NOW()')),
        sa.ForeignKeyConstraint(['case_category_id'], ['case_categories.case_category_id'], ),
        sa.ForeignKeyConstraint(['case_status_id'], ['case_status_masters.case_status_id'], ),
        sa.ForeignKeyConstraint(['court_id'], ['courts.court_id'], ),
        sa.ForeignKeyConstraint(['crime_major_head_id'], ['crime_heads.crime_head_id'], ),
        sa.ForeignKeyConstraint(['crime_minor_head_id'], ['crime_sub_heads.crime_sub_head_id'], ),
        sa.ForeignKeyConstraint(['gravity_offence_id'], ['gravity_offences.gravity_offence_id'], ),
        sa.ForeignKeyConstraint(['police_person_id'], ['employees.employee_id'], ),
        sa.ForeignKeyConstraint(['police_station_id'], ['units.unit_id'], ),
        sa.PrimaryKeyConstraint('case_master_id'),
        sa.UniqueConstraint('crime_no')
    )

    op.create_index('ix_case_masters_crime_registered_date', 'case_masters', ['crime_registered_date'])
    op.create_index('ix_case_masters_police_station_id', 'case_masters', ['police_station_id'])
    op.create_index('ix_case_masters_location', 'case_masters', ['latitude', 'longitude'])

    op.create_table('complainants',
        sa.Column('complainant_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('case_master_id', sa.Integer(), nullable=True),
        sa.Column('complainant_name', sa.String(length=255), nullable=True),
        sa.Column('age_year', sa.Integer(), nullable=True),
        sa.Column('gender_id', sa.Integer(), nullable=True),
        sa.Column('relation_type', sa.String(length=100), nullable=True),
        sa.Column('person_id', sa.String(length=50), nullable=True),
        sa.ForeignKeyConstraint(['case_master_id'], ['case_masters.case_master_id'], ),
        sa.PrimaryKeyConstraint('complainant_id')
    )

    op.create_table('victims',
        sa.Column('victim_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('case_master_id', sa.Integer(), nullable=True),
        sa.Column('victim_name', sa.String(length=255), nullable=True),
        sa.Column('age_year', sa.Integer(), nullable=True),
        sa.Column('gender_id', sa.Integer(), nullable=True),
        sa.Column('relation_type', sa.String(length=100), nullable=True),
        sa.Column('person_id', sa.String(length=50), nullable=True),
        sa.ForeignKeyConstraint(['case_master_id'], ['case_masters.case_master_id'], ),
        sa.PrimaryKeyConstraint('victim_id')
    )

    op.create_table('accused',
        sa.Column('accused_master_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('case_master_id', sa.Integer(), nullable=True),
        sa.Column('accused_name', sa.String(length=255), nullable=True),
        sa.Column('age_year', sa.Integer(), nullable=True),
        sa.Column('gender_id', sa.Integer(), nullable=True),
        sa.Column('person_id', sa.String(length=50), nullable=True),
        sa.ForeignKeyConstraint(['case_master_id'], ['case_masters.case_master_id'], ),
        sa.PrimaryKeyConstraint('accused_master_id')
    )

    op.create_table('arrest_surrender_details',
        sa.Column('arrest_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('case_master_id', sa.Integer(), nullable=True),
        sa.Column('accused_master_id', sa.Integer(), nullable=True),
        sa.Column('arrest_date', sa.Date(), nullable=True),
        sa.Column('arrest_type', sa.String(length=50), nullable=True),
        sa.Column('police_station_id', sa.Integer(), nullable=True),
        sa.Column('crime_no', sa.String(length=25), nullable=True),
        sa.ForeignKeyConstraint(['accused_master_id'], ['accused.accused_master_id'], ),
        sa.ForeignKeyConstraint(['case_master_id'], ['case_masters.case_master_id'], ),
        sa.ForeignKeyConstraint(['police_station_id'], ['units.unit_id'], ),
        sa.PrimaryKeyConstraint('arrest_id')
    )

    op.create_table('act_sections',
        sa.Column('section_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('case_master_id', sa.Integer(), nullable=True),
        sa.Column('act_name', sa.String(length=255), nullable=True),
        sa.Column('section_no', sa.String(length=50), nullable=True),
        sa.ForeignKeyConstraint(['case_master_id'], ['case_masters.case_master_id'], ),
        sa.PrimaryKeyConstraint('section_id')
    )

    # --- Analytics Tables ---

    op.create_table('crime_hotspots',
        sa.Column('hotspot_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('district_id', sa.Integer(), nullable=True),
        sa.Column('police_station_id', sa.Integer(), nullable=True),
        sa.Column('latitude', sa.DECIMAL(10, 8), nullable=True),
        sa.Column('longitude', sa.DECIMAL(11, 8), nullable=True),
        sa.Column('crime_category_id', sa.Integer(), nullable=True),
        sa.Column('crime_head_id', sa.Integer(), nullable=True),
        sa.Column('hotspot_radius_meters', sa.Integer(), nullable=True),
        sa.Column('incident_count', sa.Integer(), nullable=True),
        sa.Column('risk_score', sa.DECIMAL(5, 2), nullable=True),
        sa.Column('computed_date', sa.Date(), nullable=True),
        sa.Column('valid_until', sa.Date(), nullable=True),
        sa.ForeignKeyConstraint(['crime_category_id'], ['case_categories.case_category_id'], ),
        sa.ForeignKeyConstraint(['crime_head_id'], ['crime_heads.crime_head_id'], ),
        sa.ForeignKeyConstraint(['district_id'], ['districts.district_id'], ),
        sa.ForeignKeyConstraint(['police_station_id'], ['units.unit_id'], ),
        sa.PrimaryKeyConstraint('hotspot_id')
    )

    op.create_table('risk_predictions',
        sa.Column('prediction_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('district_id', sa.Integer(), nullable=True),
        sa.Column('police_station_id', sa.Integer(), nullable=True),
        sa.Column('crime_category_id', sa.Integer(), nullable=True),
        sa.Column('prediction_date', sa.Date(), nullable=True),
        sa.Column('forecast_date', sa.Date(), nullable=True),
        sa.Column('predicted_incidents', sa.Integer(), nullable=True),
        sa.Column('confidence_interval_low', sa.DECIMAL(5, 2), nullable=True),
        sa.Column('confidence_interval_high', sa.DECIMAL(5, 2), nullable=True),
        sa.Column('risk_level', sa.String(length=10), nullable=True),
        sa.Column('model_version', sa.String(length=20), nullable=True),
        sa.ForeignKeyConstraint(['crime_category_id'], ['case_categories.case_category_id'], ),
        sa.ForeignKeyConstraint(['district_id'], ['districts.district_id'], ),
        sa.ForeignKeyConstraint(['police_station_id'], ['units.unit_id'], ),
        sa.PrimaryKeyConstraint('prediction_id')
    )

    op.create_table('anomaly_detections',
        sa.Column('anomaly_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('case_master_id', sa.Integer(), nullable=True),
        sa.Column('anomaly_type', sa.String(length=50), nullable=True),
        sa.Column('anomaly_score', sa.DECIMAL(5, 4), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('detected_at', sa.DateTime(), nullable=True, server_default=sa.text('NOW()')),
        sa.Column('reviewed', sa.Boolean(), nullable=True, server_default=sa.text('0')),
        sa.Column('reviewed_by', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['case_master_id'], ['case_masters.case_master_id'], ),
        sa.ForeignKeyConstraint(['reviewed_by'], ['employees.employee_id'], ),
        sa.PrimaryKeyConstraint('anomaly_id')
    )

    op.create_table('mo_patterns',
        sa.Column('pattern_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('accused_master_id', sa.Integer(), nullable=True),
        sa.Column('pattern_signature', sa.Text(), nullable=True),
        sa.Column('associated_cases', sa.Text(), nullable=True),
        sa.Column('first_seen', sa.Date(), nullable=True),
        sa.Column('last_seen', sa.Date(), nullable=True),
        sa.Column('evolution_score', sa.DECIMAL(5, 2), nullable=True),
        sa.ForeignKeyConstraint(['accused_master_id'], ['accused.accused_master_id'], ),
        sa.PrimaryKeyConstraint('pattern_id')
    )

    op.create_table('alerts',
        sa.Column('alert_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('alert_type', sa.String(length=50), nullable=True),
        sa.Column('severity', sa.String(length=20), nullable=True),
        sa.Column('district_id', sa.Integer(), nullable=True),
        sa.Column('police_station_id', sa.Integer(), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('data', sa.Text(), nullable=True),
        sa.Column('is_read', sa.Boolean(), nullable=True, server_default=sa.text('0')),
        sa.Column('created_at', sa.DateTime(), nullable=True, server_default=sa.text('NOW()')),
        sa.ForeignKeyConstraint(['district_id'], ['districts.district_id'], ),
        sa.ForeignKeyConstraint(['police_station_id'], ['units.unit_id'], ),
        sa.PrimaryKeyConstraint('alert_id')
    )


def downgrade() -> None:
    op.drop_table('alerts')
    op.drop_table('mo_patterns')
    op.drop_table('anomaly_detections')
    op.drop_table('risk_predictions')
    op.drop_table('crime_hotspots')
    op.drop_table('act_sections')
    op.drop_table('arrest_surrender_details')
    op.drop_table('accused')
    op.drop_table('victims')
    op.drop_table('complainants')
    op.drop_table('case_masters')
    op.drop_index('ix_case_masters_location', 'case_masters')
    op.drop_index('ix_case_masters_police_station_id', 'case_masters')
    op.drop_index('ix_case_masters_crime_registered_date', 'case_masters')
    op.drop_table('users')
    op.drop_table('employees')
    op.drop_table('courts')
    op.drop_table('case_status_masters')
    op.drop_table('gravity_offences')
    op.drop_table('case_categories')
    op.drop_table('crime_sub_heads')
    op.drop_table('crime_heads')
    op.drop_table('units')
    op.drop_table('unit_types')
    op.drop_table('districts')
    op.drop_table('states')
    op.drop_table('nationalities')
