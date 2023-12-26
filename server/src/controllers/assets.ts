import { Request, Response } from "express";
import { createAsset, deleteAsset, getAssetsForUser } from "../database/assets";

export default {
  getAssetsByUserId: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const assets = await getAssetsForUser(Number(userId));
      res.status(200).json(assets);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch asset data" });
    }
  },

  createAsset: async (req: Request, res: Response) => {
    try {
      const { value, name, description } = req.body;
      const asset = await createAsset(Number(value), name, description);
      res.status(200).json(asset);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create new asset" });
    }
  },

  deleteAsset: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await deleteAsset(Number(id));
      console.log(`ASSET ${id} DELETED`);
      res.status(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete asset" });
    }
  },
};
