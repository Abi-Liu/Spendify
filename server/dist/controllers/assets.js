"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assets_1 = require("../database/assets");
exports.default = {
    getAssetsByUserId: async (req, res) => {
        try {
            const { userId } = req.params;
            const assets = await (0, assets_1.getAssetsForUser)(Number(userId));
            res.status(200).json(assets);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: "Failed to fetch asset data" });
        }
    },
    createAsset: async (req, res) => {
        try {
            const { userId, value, name, description } = req.body;
            const asset = await (0, assets_1.createAsset)(Number(userId), Number(value), name, description);
            res.status(200).json(asset);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to create new asset" });
        }
    },
    deleteAsset: async (req, res) => {
        try {
            const { id } = req.params;
            await (0, assets_1.deleteAsset)(Number(id));
            console.log(`ASSET ${id} DELETED`);
            res.status(200);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to delete asset" });
        }
    },
};
//# sourceMappingURL=assets.js.map