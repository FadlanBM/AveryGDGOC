// Dummy data untuk create contract - CORRECT FORMAT
const dummyContractData = {
  id_tenant: "550e8400-e29b-41d4-a716-446655440000",  // UUID format
  id_room: "123e4567-e89b-12d3-a456-426614174000",    // UUID format
  contract_number: "CTR-2024-001",                      // Contract number format
  monthly_rent: 2500000,                                // Number (dalam rupiah)
  start_date: "2024-12-01",                             // YYYY-MM-DD format
  end_date: "2025-11-30",                               // YYYY-MM-DD format
  contract_status: "active",                            // active/expired/terminated
  notes: "Kontrak sewa tahunan untuk kamar tipe deluxe" // Optional notes
};

// Multiple dummy data examples
const dummyContracts = [
  {
    id_tenant: "550e8400-e29b-41d4-a716-446655440000",
    id_room: "123e4567-e89b-12d3-a456-426614174000",
    contract_number: "CTR-2024-001",
    monthly_rent: 2500000,
    start_date: "2024-12-01",
    end_date: "2025-11-30",
    contract_status: "active",
    notes: "Kontrak sewa tahunan untuk kamar tipe deluxe"
  },
  {
    id_tenant: "550e8400-e29b-41d4-a716-446655440001",
    id_room: "123e4567-e89b-12d3-a456-426614174001",
    contract_number: "CTR-2024-002",
    monthly_rent: 1800000,
    start_date: "2024-11-15",
    end_date: "2025-11-14",
    contract_status: "active",
    notes: "Kontrak sewa kamar tipe standard"
  },
  {
    id_tenant: "550e8400-e29b-41d4-a716-446655440002",
    id_room: "123e4567-e89b-12d3-a456-426614174002",
    contract_number: "CTR-2023-003",
    monthly_rent: 3200000,
    start_date: "2023-01-01",
    end_date: "2024-12-31",
    contract_status: "expired",
    notes: "Kontrak sewa kamar VIP - sudah berakhir"
  },
  {
    id_tenant: "550e8400-e29b-41d4-a716-446655440003",
    id_room: "123e4567-e89b-12d3-a456-426614174003",
    contract_number: "CTR-2024-004",
    monthly_rent: 1500000,
    start_date: "2024-10-01",
    end_date: "2025-09-30",
    contract_status: "terminated",
    notes: "Kontrak dihentikan lebih awal karena pindah"
  }
];

// Invalid examples (untuk testing validasi)
const invalidExamples = {
  // ID bukan UUID
  invalid_id: {
    id_tenant: "adnan",  // ❌ Bukan UUID
    id_room: "1234572839273895",  // ❌ Bukan UUID
    contract_number: "CTR-2024-001",
    monthly_rent: 2500000,
    start_date: "2024-12-01",
    end_date: "2025-11-30",
    contract_status: "active",
    notes: "Test invalid ID"
  },

  // Monthly rent bukan number
  invalid_rent: {
    id_tenant: "550e8400-e29b-41d4-a716-446655440000",
    id_room: "123e4567-e89b-12d3-a456-426614174000",
    contract_number: "CTR-2024-001",
    monthly_rent: "0857273727712",  // ❌ String, bukan number
    start_date: "2024-12-01",
    end_date: "2025-11-30",
    contract_status: "active",
    notes: "Test invalid rent type"
  },

  // Date format salah
  invalid_date: {
    id_tenant: "550e8400-e29b-41d4-a716-446655440000",
    id_room: "123e4567-e89b-12d3-a456-426614174000",
    contract_number: "CTR-2024-001",
    monthly_rent: 2500000,
    start_date: "adnan@mail.ugs",  // ❌ Bukan date format
    end_date: "085772832771",     // ❌ Bukan date format
    contract_status: "active",
    notes: "Test invalid date format"
  },

  // Invalid contract status
  invalid_status: {
    id_tenant: "550e8400-e29b-41d4-a716-446655440000",
    id_room: "123e4567-e89b-12d3-a456-426614174000",
    contract_number: "CTR-2024-001",
    monthly_rent: 2500000,
    start_date: "2024-12-01",
    end_date: "2025-11-30",
    contract_status: "085772832771",  // ❌ Bukan active/expired/terminated
    notes: "Test invalid status"
  }
};

module.exports = {
  dummyContractData,
  dummyContracts,
  invalidExamples
};