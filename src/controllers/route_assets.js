import { filterObjectByFields } from "../utils/route_utils.js";
import Asset from "../models/Asset.js";

export default function setupAssetRoutes(api_router, userDb, assetDb) {
    // User Property Endpoints (Assets)
    api_router.route('/users/:userId/assets').get(async (req, res) => {
        try {
            const user = await userDb.getUser(req.params.userId);
            if (!user) {
                return res.status(404).json({ "error": "User not found" });
            }

            let assets = await assetDb.getUserAssets(req.params.userId);
            let assetsJson = assets.map(asset => asset.toJSON());
            const fieldsParam = req.query.fields;

            if (fieldsParam) {
                const fields = fieldsParam.split(',');
                assetsJson = assetsJson.map(asset => filterObjectByFields(asset, fields));
            }

            if (assetsJson && assetsJson.length > 0) {
                res.json(assetsJson);
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

    api_router.route('/users/:userId/assets/filter').post(async (req, res) => {
        try {
            const userId = req.params.userId;
            const user = await userDb.getUser(userId);
            if (!user) {
                return res.status(404).json({ "error": "User not found" });
            }

            const filter = req.body;

            const allAssets = await assetDb.getUserAssets(userId);
            const filteredAssets = allAssets.filter(asset => {
                return Object.keys(filter).every(key => asset.toJSON()[key] === filter[key]);
            });

            if (filteredAssets.length > 0) {
                res.json(filteredAssets.map(asset => asset.toJSON()));
            } else {
                res.status(200).json([]);
            }
        } catch (error) {
            res.status(500).json({ "error": error.message });
        }
    });

    api_router.route('/users/:userId/assets').post(async (req, res) => {
        try {
            const newAssetData = req.body;
            newAssetData.user = req.params.userId;
            const newAsset = new Asset(newAssetData);
            const response = await assetDb.postAsset(newAsset);
            res.status(201).json(response);
        } catch (error) {
            res.status(500).json({ "error": error.message });
        }
    });

    api_router.route('/users/:userId/assets/:id').put(async (req, res) => {
        try {
            const assetId = req.params.id;
            const updatedAssetData = req.body;
            updatedAssetData.user = req.params.userId; // Ensure user ID is set
            const updatedAsset = new Asset(updatedAssetData);
            const response = await assetDb.putAsset(assetId, updatedAsset);
            res.status(200).json({ ok: response.ok });
        } catch (error) {
            res.status(500).json({ "error": error.message });
        }
    });

    api_router.route('/users/:userId/assets/:id').delete(async (req, res) => {
        try {
            const assetId = req.params.id;
            const response = await assetDb.deleteDocument(assetId);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ "error": error.message });
        }
    });

    // Generic Asset Property Endpoint
    api_router.route('/users/:userId/assets/:id/:property').get(async (req, res) => {
        const assetId = req.params.id;
        const property = req.params.property;
        const assets =  await assetDb.getUserAssets(req.params.userId);
        const asset = assets.find(a => a.get_Id() === assetId);

        if (asset) {
            const assetJson = asset.toJSON();
            if (assetJson.hasOwnProperty(property)) {
                res.json({ [property]: assetJson[property] });
            } else {
                res.status(404).json({ "error": `Property '${property}' not found for asset with ID '${assetId}'` });
            }
        } else {
            res.status(404).json({ "error": `Asset with ID '${assetId}' not found` });
        }
    });
}
