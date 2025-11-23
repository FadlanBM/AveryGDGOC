-- CREATE TYPE user_roles AS ENUM ('admin', 'owner', 'user');
-- CREATE TYPE payment_types AS ENUM ('cash', 'transfer', 'e-wallet');
-- CREATE TYPE contract_statuses AS ENUM ('active', 'expired', 'terminated');
-- CREATE TYPE payment_statuses AS ENUM ('paid', 'unpaid', 'partial');
-- CREATE TYPE room_types AS ENUM ('standard', 'deluxe', 'vip');

create table menu (
	id uuid PRIMARY KEY,
	name varchar(100) NOT NULL,
	category varchar(50) UNIQUE NOT NULL,
	calories INTEGER NOT NULL,
	price DECIMAL(10,2) DEFAULT 0,
	ingredients varchar(255) NOT NULL,
	description TEXT,
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- create table rooms (
-- 	id uuid PRIMARY KEY,
-- 	room_number varchar(10) UNIQUE NOT NULL,
-- 	room_type room_types NOT NULL,
-- 	capacity INTEGER DEFAULT 1,
-- 	monthly_price DECIMAL(10,2) NOT NULL,
-- 	available BOOLEAN DEFAULT true,
-- 	floor_number INTEGER DEFAULT 1,
-- 	description TEXT,
-- 	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     deleted_at TIMESTAMPTZ
-- );

-- ALTER TABLE tenants
-- DROP COLUMN emergency_contact; 

-- create table tenants (
-- 	id uuid PRIMARY KEY,
-- 	nama varchar(100) NOT NULL,
-- 	nik varchar(30) UNIQUE,
-- 	alamat TEXT,
-- 	phone_number varchar(20) NOT NULL,
-- 	email varchar(100),
-- 	emergency_contact varchar(100),
-- 	emergency_phone varchar(20),
-- 	id_card_number varchar(50),
-- 	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     deleted_at TIMESTAMPTZ
-- );

-- create table contracts (
-- 	id uuid PRIMARY KEY,
-- 	id_tenant uuid NOT NULL,
-- 	id_room uuid NOT NULL,
-- 	FOREIGN KEY (id_tenant) REFERENCES tenants (id) ON DELETE CASCADE,
-- 	FOREIGN KEY (id_room) REFERENCES rooms (id) ON DELETE CASCADE,
-- 	contract_number varchar(50) UNIQUE NOT NULL,
-- 	monthly_rent DECIMAL(10,2) NOT NULL,
-- 	deposit_amount DECIMAL(10,2) DEFAULT 0,
-- 	utility_fee DECIMAL(10,2) DEFAULT 0,
-- 	other_fees DECIMAL(10,2) DEFAULT 0,
-- 	total_monthly_amount DECIMAL(10,2) GENERATED ALWAYS AS (monthly_rent + utility_fee + other_fees) STORED,
-- 	start_date DATE NOT NULL,
-- 	end_date DATE NOT NULL,
-- 	payment_due_day INTEGER DEFAULT 1,
-- 	contract_status contract_statuses DEFAULT 'active',
-- 	notes TEXT,
-- 	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     deleted_at TIMESTAMPTZ
-- );

-- create table payments (
-- 	id uuid PRIMARY KEY,
-- 	id_contract uuid NOT NULL,
-- 	FOREIGN KEY (id_contract) REFERENCES contracts (id) ON DELETE CASCADE,
-- 	payment_number varchar(50) UNIQUE NOT NULL,
-- 	payment_period_start DATE NOT NULL,
-- 	payment_period_end DATE NOT NULL,
-- 	rent_amount DECIMAL(10,2) NOT NULL,
-- 	utility_amount DECIMAL(10,2) DEFAULT 0,
-- 	other_fees_amount DECIMAL(10,2) DEFAULT 0,
-- 	total_amount DECIMAL(10,2) GENERATED ALWAYS AS (rent_amount + utility_amount + other_fees_amount) STORED,
-- 	paid_amount DECIMAL(10,2) DEFAULT 0,
-- 	payment_status payment_statuses DEFAULT 'unpaid',
-- 	payment_type payment_types NOT NULL,
-- 	payment_date DATE,
-- 	due_date DATE NOT NULL,
-- 	late_fee DECIMAL(10,2) DEFAULT 0,
-- 	notes TEXT,
-- 	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     deleted_at TIMESTAMPTZ
-- );

-- create table payment_transactions (
-- 	id uuid PRIMARY KEY,
-- 	id_payment uuid NOT NULL,
-- 	FOREIGN KEY (id_payment) REFERENCES payments (id) ON DELETE CASCADE,
-- 	transaction_number varchar(50) UNIQUE NOT NULL,
-- 	transaction_amount DECIMAL(10,2) NOT NULL,
-- 	transaction_type payment_types NOT NULL,
-- 	transaction_date DATE NOT NULL,
-- 	reference_number varchar(100),
-- 	bank_name varchar(100),
-- 	transaction_notes TEXT,
-- 	created_by uuid,
-- 	FOREIGN KEY (created_by) REFERENCES users (id),
-- 	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     deleted_at TIMESTAMPTZ
-- );

-- create table expenses (
-- 	id uuid PRIMARY KEY,
-- 	expense_category varchar(50) NOT NULL,
-- 	expense_name varchar(100) NOT NULL,
-- 	amount DECIMAL(10,2) NOT NULL,
-- 	expense_date DATE NOT NULL,
-- 	description TEXT,
-- 	receipt_number varchar(50),
-- 	created_by uuid,
-- 	FOREIGN KEY (created_by) REFERENCES users (id),
-- 	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     deleted_at TIMESTAMPTZ
-- );

-- create table financial_reports (
-- 	id uuid PRIMARY KEY,
-- 	report_type varchar(50) NOT NULL,
-- 	report_period_start DATE NOT NULL,
-- 	report_period_end DATE NOT NULL,
-- 	total_income DECIMAL(10,2) DEFAULT 0,
-- 	total_expenses DECIMAL(10,2) DEFAULT 0,
-- 	net_income DECIMAL(10,2) GENERATED ALWAYS AS (total_income - total_expenses) STORED,
-- 	report_data JSONB,
-- 	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
-- );

-- -- Indexes for better performance
-- CREATE INDEX idx_tenants_phone ON tenants(phone_number);
-- CREATE INDEX idx_tenants_nik ON tenants(nik);
-- CREATE INDEX idx_rooms_available ON rooms(available);
-- CREATE INDEX idx_rooms_type ON rooms(room_type);
-- CREATE INDEX idx_contracts_tenant ON contracts(id_tenant);
-- CREATE INDEX idx_contracts_room ON contracts(id_room);
-- CREATE INDEX idx_contracts_status ON contracts(contract_status);
-- CREATE INDEX idx_payments_contract ON payments(id_contract);
-- CREATE INDEX idx_payments_status ON payments(payment_status);
-- CREATE INDEX idx_payments_due_date ON payments(due_date);
-- CREATE INDEX idx_payment_transactions_payment ON payment_transactions(id_payment);
-- CREATE INDEX idx_expenses_date ON expenses(expense_date);
-- CREATE INDEX idx_expenses_category ON expenses(expense_category);

-- -- Constraints for data integrity
-- ALTER TABLE contracts ADD CONSTRAINT check_dates_valid CHECK (end_date > start_date);
-- ALTER TABLE contracts ADD CONSTRAINT check_payment_due_day CHECK (payment_due_day BETWEEN 1 AND 31);
-- ALTER TABLE payments ADD CONSTRAINT check_payment_dates CHECK (payment_period_end >= payment_period_start);
-- ALTER TABLE payments ADD CONSTRAINT check_paid_amount CHECK (paid_amount >= 0 AND paid_amount <= total_amount);
-- ALTER TABLE payment_transactions ADD CONSTRAINT check_transaction_amount CHECK (transaction_amount > 0);

-- -- Triggers for automatic updates
-- CREATE OR REPLACE FUNCTION update_room_availability() RETURNS TRIGGER AS $$
-- BEGIN
--     IF TG_OP = 'INSERT' THEN
--         UPDATE rooms SET available = false WHERE id = NEW.id_room;
--     ELSIF TG_OP = 'UPDATE' THEN
--         IF OLD.contract_status != 'active' AND NEW.contract_status = 'active' THEN
--             UPDATE rooms SET available = false WHERE id = NEW.id_room;
--         ELSIF OLD.contract_status = 'active' AND NEW.contract_status != 'active' THEN
--             UPDATE rooms SET available = true WHERE id = NEW.id_room;
--         END IF;
--     ELSIF TG_OP = 'DELETE' THEN
--         UPDATE rooms SET available = true WHERE id = OLD.id_room;
--     END IF;
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER trigger_update_room_availability
--     AFTER INSERT OR UPDATE OR DELETE ON contracts
--     FOR EACH ROW EXECUTE FUNCTION update_room_availability();

