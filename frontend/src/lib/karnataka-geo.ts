export interface DistrictGeo {
  id: number;
  name: string;
  center: [number, number];
  bounds: [[number, number], [number, number]];
}

// IDs match backend seeder order
export const DISTRICT_GEO: DistrictGeo[] = [
  { id: 1,  name: "Bengaluru Urban",    center: [12.97, 77.6], bounds: [[12.8, 77.5], [13.1, 77.7]] },
  { id: 2,  name: "Bengaluru Rural",     center: [13.08, 77.6], bounds: [[12.9, 77.4], [13.3, 77.8]] },
  { id: 3,  name: "Mysuru",              center: [12.30, 76.6], bounds: [[12.0, 76.3], [12.6, 76.9]] },
  { id: 4,  name: "Dakshina Kannada",    center: [12.87, 74.8], bounds: [[12.6, 74.7], [13.2, 75.0]] },
  { id: 5,  name: "Dharwad",             center: [15.46, 75.0], bounds: [[15.2, 74.7], [15.8, 75.3]] },
  { id: 6,  name: "Belagavi",            center: [15.85, 74.5], bounds: [[15.5, 74.1], [16.3, 74.9]] },
  { id: 7,  name: "Ballari",             center: [15.14, 76.9], bounds: [[14.8, 76.6], [15.4, 77.2]] },
  { id: 8,  name: "Hassan",              center: [13.01, 76.1], bounds: [[12.7, 75.8], [13.3, 76.4]] },
  { id: 9,  name: "Mandya",              center: [12.52, 76.9], bounds: [[12.2, 76.5], [12.8, 77.1]] },
  { id: 10, name: "Tumakuru",            center: [13.34, 77.1], bounds: [[13.0, 76.8], [13.6, 77.4]] },
  { id: 11, name: "Shivamogga",          center: [13.93, 75.6], bounds: [[13.6, 75.3], [14.2, 75.9]] },
  { id: 12, name: "Davangere",           center: [14.46, 75.9], bounds: [[14.2, 75.6], [14.8, 76.2]] },
  { id: 13, name: "Chitradurga",         center: [14.22, 76.4], bounds: [[13.9, 76.1], [14.5, 76.7]] },
  { id: 14, name: "Kodagu",              center: [12.34, 75.8], bounds: [[12.1, 75.4], [12.7, 76.0]] },
  { id: 15, name: "Raichur",             center: [16.21, 77.3], bounds: [[15.9, 77.0], [16.5, 77.6]] },
  { id: 16, name: "Kalaburagi",          center: [17.34, 76.8], bounds: [[17.0, 76.5], [17.6, 77.1]] },
  { id: 17, name: "Bidar",               center: [17.91, 77.5], bounds: [[17.6, 77.2], [18.2, 77.8]] },
  { id: 18, name: "Koppal",              center: [15.35, 76.2], bounds: [[15.0, 75.9], [15.6, 76.5]] },
  { id: 19, name: "Uttara Kannada",      center: [14.80, 74.1], bounds: [[14.4, 74.0], [15.2, 74.8]] },
  { id: 20, name: "Udupi",               center: [13.34, 74.7], bounds: [[13.0, 74.5], [13.6, 75.1]] },
  { id: 21, name: "Chamarajanagar",      center: [11.93, 76.9], bounds: [[11.6, 76.6], [12.2, 77.2]] },
  { id: 22, name: "Ramanagara",          center: [12.72, 77.3], bounds: [[12.4, 77.0], [13.0, 77.6]] },
  { id: 23, name: "Chikkaballapura",     center: [13.44, 77.7], bounds: [[13.1, 77.4], [13.7, 78.0]] },
  { id: 24, name: "Kolar",               center: [13.14, 78.1], bounds: [[12.8, 77.8], [13.4, 78.4]] },
  { id: 25, name: "Bagalkote",           center: [16.19, 75.7], bounds: [[15.9, 75.4], [16.4, 76.0]] },
  { id: 26, name: "Gadag",               center: [15.43, 75.6], bounds: [[15.1, 75.3], [15.7, 75.9]] },
  { id: 27, name: "Haveri",              center: [14.79, 75.4], bounds: [[14.5, 75.1], [15.1, 75.7]] },
  { id: 28, name: "Yadgir",              center: [16.77, 77.1], bounds: [[16.5, 76.8], [17.1, 77.4]] },
  { id: 29, name: "Vijayapura",          center: [16.83, 75.7], bounds: [[16.5, 75.4], [17.1, 76.0]] },
  { id: 30, name: "Chikkmagaluru",       center: [13.32, 75.8], bounds: [[13.0, 75.5], [13.6, 76.1]] },
  { id: 31, name: "Vijayanagara",        center: [15.34, 76.5], bounds: [[15.0, 76.2], [15.5, 76.8]] },
];
