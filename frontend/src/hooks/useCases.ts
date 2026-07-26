import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api";

export interface FIRCase {
    fir_id: number;
    fir_number: string;
    district_name: string;
    station_name: string;
    category_name: string;
    incident_date: string;
    filing_date: string;
    status: "UNDER_INVESTIGATION" | "CHARGESHEET_FILED" | "PENDING" | "CLOSED";
    complainant_name: string;
    ipc_sections: string[];
    accused_names: string[];
    description: string;
    latitude: number;
    longitude: number;
}

const MOCK_CASES: FIRCase[] = [
    {
        fir_id: 1,
        fir_number: "KA-2026-FIR-0042",
        district_name: "Bengaluru Urban",
        station_name: "Koramangala PS",
        category_name: "Armed Robbery",
        incident_date: "2026-07-22 22:30",
        filing_date: "2026-07-23 09:15",
        status: "UNDER_INVESTIGATION",
        complainant_name: "Anand Murthy",
        ipc_sections: ["Section 392 (Robbery)", "Section 397 (Dacoity with attempt to cause death)"],
        accused_names: ["Ramesh Kumar (Alias: Kaliya)", "Suresh Gowda"],
        description: "Two masked assailants on a Pulsar 220 motorcycle brandished weapons and looted ₹1.5L cash and jewelry near Koramangala 5th Block.",
        latitude: 12.9352,
        longitude: 77.6245
    },
    {
        fir_id: 2,
        fir_number: "KA-2026-FIR-0108",
        district_name: "Bengaluru Urban",
        station_name: "Indiranagar PS",
        category_name: "Cyber Crime",
        incident_date: "2026-07-20 14:10",
        filing_date: "2026-07-21 11:00",
        status: "UNDER_INVESTIGATION",
        complainant_name: "Priya Sharma",
        ipc_sections: ["IT Act Sec 66D (Cheating by personation using computer resource)", "IPC 420 (Cheating)"],
        accused_names: ["Venkatesh Naik", "Mohammed Saif"],
        description: "SIM swap phishing resulting in unauthorized debit of ₹4.8 Lakhs across multiple digital wallet accounts.",
        latitude: 12.9784,
        longitude: 77.6408
    },
    {
        fir_id: 3,
        fir_number: "KA-2026-FIR-0215",
        district_name: "Mysuru",
        station_name: "Lashkar PS",
        category_name: "Vehicle Theft",
        incident_date: "2026-07-18 19:45",
        filing_date: "2026-07-19 08:30",
        status: "CHARGESHEET_FILED",
        complainant_name: "Kiran Gowda",
        ipc_sections: ["IPC Section 379 (Theft)"],
        accused_names: ["Ramesh Kumar (Alias: Kaliya)"],
        description: "White Hyundai Creta (KA-09-MA-4421) stolen from Mysuru Palace north gate parking.",
        latitude: 12.3052,
        longitude: 76.6552
    },
    {
        fir_id: 4,
        fir_number: "KA-2026-FIR-0340",
        district_name: "Mangaluru",
        station_name: "Pandeshwar PS",
        category_name: "Extortion",
        incident_date: "2026-07-15 16:00",
        filing_date: "2026-07-16 10:20",
        status: "CLOSED",
        complainant_name: "Sunil Merchant Association",
        ipc_sections: ["IPC Section 384 (Extortion)", "IPC Section 506 (Criminal Intimidation)"],
        accused_names: ["Mohammed Saif"],
        description: "Protection money extortion letters delivered to local seafood trading shops.",
        latitude: 12.8687,
        longitude: 74.8422
    },
    {
        fir_id: 5,
        fir_number: "KA-2026-FIR-0412",
        district_name: "Kalaburagi",
        station_name: "Station Bazaar PS",
        category_name: "Property Damage",
        incident_date: "2026-07-12 02:15",
        filing_date: "2026-07-12 09:00",
        status: "PENDING",
        complainant_name: "KSRTC Depot Manager",
        ipc_sections: ["IPC Section 427 (Mischief causing damage)"],
        accused_names: ["Unknown Gang"],
        description: "Vandalism and window shattering on 4 KSRTC buses inside central bus terminal.",
        latitude: 17.3297,
        longitude: 76.8343
    }
];

export function useCases() {
    const [cases, setCases] = useState<FIRCase[]>(MOCK_CASES);
    const [loading, setLoading] = useState(false);

    const fetchCases = useCallback(async (params?: Record<string, unknown>) => {
        setLoading(true);
        try {
            const data = await api.get<FIRCase[]>("/cases", params);
            if (data && data.length > 0) {
                setCases(data);
            } else {
                setCases(MOCK_CASES);
            }
        } catch {
            setCases(MOCK_CASES);
        }
        setLoading(false);
    }, []);

    const createCase = useCallback(async (newCase: Partial<FIRCase>) => {
        try {
            const created = await api.post<FIRCase>("/cases", newCase);
            setCases(prev => [created, ...prev]);
            return created;
        } catch {
            const fallback: FIRCase = {
                fir_id: Date.now(),
                fir_number: `KA-2026-FIR-${Math.floor(1000 + Math.random() * 9000)}`,
                district_name: newCase.district_name || "Bengaluru Urban",
                station_name: newCase.station_name || "Central PS",
                category_name: newCase.category_name || "Property Crime",
                incident_date: newCase.incident_date || new Date().toISOString().slice(0, 16).replace("T", " "),
                filing_date: new Date().toISOString().slice(0, 16).replace("T", " "),
                status: "UNDER_INVESTIGATION",
                complainant_name: newCase.complainant_name || "Anonymous",
                ipc_sections: newCase.ipc_sections || ["IPC Section 379"],
                accused_names: newCase.accused_names || ["Under Investigation"],
                description: newCase.description || "FIR registered in Crime Intelligence System.",
                latitude: newCase.latitude || 12.9716,
                longitude: newCase.longitude || 77.5946
            };
            setCases(prev => [fallback, ...prev]);
            return fallback;
        }
    }, []);

    useEffect(() => {
        fetchCases();
    }, [fetchCases]);

    return { cases, loading, fetchCases, createCase };
}

export default useCases;
