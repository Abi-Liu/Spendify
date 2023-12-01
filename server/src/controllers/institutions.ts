import { Request, Response } from "express";
import { plaidClient } from "../config/plaid";
import { CountryCode } from "plaid";

export default {
  // returns a single institution based on the id given by the client
  getInstitutionById: async (req: Request, res: Response) => {
    const { institutionId } = req.params;

    const request = {
      institution_id: institutionId,
      country_codes: [CountryCode.Us],
      include_optional_metadata: true,
    };
    try {
      const { data } = await plaidClient.institutionsGetById(request);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching institution data" });
    }
  },
};
