export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  logoComponent: string;
  location: string;
  modelsAvailable: number;
  stock: number;
  rating: number;
  brandColor?: string; // Color personalizado de la marca
}

export const brands: Brand[] = [
  {
    id: "hyundai",
    name: "Hyundai",
    logoUrl: "/hyundai-svgrepo-com.svg",
    logoComponent: "HyundaiLogo",
    location: "Av. Principal 123",
    modelsAvailable: 12,
    stock: 45,
    rating: 4.5,
    brandColor: "#002C5F", // Azul Hyundai
  },
  {
    id: "toyota",
    name: "Toyota",
    logoUrl: "/toyota-svgrepo-com.svg",
    logoComponent: "ToyotaLogo",
    location: "Calle Central 456",
    modelsAvailable: 15,
    stock: 60,
    rating: 4.8,
    brandColor: "#EB0A1E", // Rojo Toyota
  },
  {
    id: "kia",
    name: "Kia",
    logoUrl: "/kia-svgrepo-com.svg",
    logoComponent: "KiaLogo",
    location: "Blvd. Norte 789",
    modelsAvailable: 10,
    stock: 35,
    rating: 4.3,
    brandColor: "#05141F", // Negro Kia
  },
  {
    id: "chevrolet",
    name: "Chevrolet",
    logoUrl: "/chevrolet-svgrepo-com.svg",
    logoComponent: "ChevroletLogo",
    location: "Av. Sur 101",
    modelsAvailable: 18,
    stock: 70,
    rating: 4.2,
    brandColor: "#FFC72C", // Dorado Chevrolet
  },
  {
    id: "peugeot",
    name: "Peugeot",
    logoUrl: "/peugeot-alt-svgrepo-com.svg",
    logoComponent: "PeugeotLogo",
    location: "Calle Oeste 212",
    modelsAvailable: 8,
    stock: 25,
    rating: 4.0,
    brandColor: "#1F2937", // Gris Peugeot
  },
  {
    id: "ford",
    name: "Ford",
    logoUrl: "/ford-svgrepo-com.svg",
    logoComponent: "FordLogo",
    location: "Av. Este 313",
    modelsAvailable: 20,
    stock: 80,
    rating: 4.6,
    brandColor: "#003478", // Azul Ford
  },
];