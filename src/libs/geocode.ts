import { env_validation } from "@/utils/env_validation";
import axios from "axios";

export const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    const url: string = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${env_validation.google_map_api}`;

    try {
        const response = await axios.get(url);
        const { data } = response;

        if (data.status === "OK" && data.results.length > 0) {
            return data.results[0].formatted_address;
        }
        console.error("No results found for the given coordinates");
        return null;
    } catch (error) {
        console.error("Error during reverse geocoding:", error);
        return null;
    }
};
