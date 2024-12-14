import { env_validation } from "@/utils/env_validation";
import axios from "axios";

export const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${env_validation.google_map_api}`;

    try {
        const { data } = await axios.get(url);

        if (data.status === "OK" && data.results.length > 0) {
            return data.results[0].formatted_address;
        }
        // 明示的にエラーをスローすることで後続処理での分岐を明確化
        throw new Error("No results found for the given coordinates");
    } catch (error: unknown) {
        console.error("Reverse geocoding failed:", error);
        return null;
    }
};

export default reverseGeocode;
