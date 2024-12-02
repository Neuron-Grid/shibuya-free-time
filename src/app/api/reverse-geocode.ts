import { reverseGeocode } from "@/libs/geocode";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const latitude = Number.parseFloat(lat as string);
    const longitude = Number.parseFloat(lng as string);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return res.status(400).json({ error: "Invalid latitude or longitude" });
    }

    const address = await reverseGeocode(latitude, longitude);

    if (address) {
        res.status(200).json({ address });
    } else {
        res.status(404).json({ error: "Address not found" });
    }
}
