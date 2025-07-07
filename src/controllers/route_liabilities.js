import { filterObjectByFields } from "../utils/route_utils.js";
import Liability from "../models/Liability.js";

export default function setupLiabilityRoutes(api_router, userDb, liabilityDb) {
    // User Property Endpoints (Liabilities)
    api_router.route('/users/:userId/liabilities').get(async (req, res) => {
        try {
            const user = await userDb.getUser(req.params.userId);
            if (!user) {
                return res.status(404).json({ "error": "User not found" });
            }

            let liabilities = await liabilityDb.getUserLiabilities(req.params.userId);
            let liabilitiesJson = liabilities.map(liability => liability.toJSON());
            const fieldsParam = req.query.fields;

            if (fieldsParam) {
                const fields = fieldsParam.split(',');
                liabilitiesJson = liabilitiesJson.map(liability => filterObjectByFields(liability, fields));
            }

            if (liabilitiesJson && liabilitiesJson.length > 0) {
                res.json(liabilitiesJson);
            } else {
                res.status(200).json([]);
            }
        } catch (error) {
            if (error.message.startsWith("Field '")) {
                res.status(404).json({ "error": error.message });
            } else {
                res.status(500).json({ "error": error.message });
            }
        }
    });

    api_router.route('/users/:userId/liabilities').post(async (req, res) => {
        try {
            const newLiabilityData = req.body;
            newLiabilityData.user = req.params.userId;
            const newLiability = new Liability(newLiabilityData);
            const response = await liabilityDb.postLiability(newLiability);
            res.status(201).json(response);
        } catch (error) {
            res.status(500).json({ "error": error.message });
        }
    });

    api_router.route('/users/:userId/liabilities/:id').put(async (req, res) => {
        try {
            const liabilityId = req.params.id;
            const updatedLiabilityData = req.body;
            updatedLiabilityData.user = req.params.userId; // Ensure user ID is set
            const updatedLiability = new Liability(updatedLiabilityData);
            const response = await liabilityDb.putLiability(liabilityId, updatedLiability);
            res.status(200).json({ ok: response.ok });
        } catch (error) {
            res.status(500).json({ "error": error.message });
        }
    });

    api_router.route('/users/:userId/liabilities/:id').delete(async (req, res) => {
        try {
            const liabilityId = req.params.id;
            const response = await liabilityDb.deleteDocument(liabilityId);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ "error": error.message });
        }
    });

    // Generic Liability Property Endpoint
    api_router.route('/users/:userId/liabilities/:id/:property').get(async (req, res) => {
        const liabilityId = req.params.id;
        const property = req.params.property;
        const liabilities = await liabilityDb.getUserLiabilities(req.params.userId);
        const liability = liabilities.find(l => l.get_Id() === liabilityId);

        if (liability) {
            const liabilityJson = liability.toJSON();
            if (liabilityJson.hasOwnProperty(property)) {
                res.json({ [property]: liabilityJson[property] });
            } else {
                res.status(404).json({ "error": `Property '${property}' not found for liability with ID '${liabilityId}'` });
            }
        } else {
            res.status(404).json({ "error": `Liability with ID '${liabilityId}' not found` });
        }
    });
}
