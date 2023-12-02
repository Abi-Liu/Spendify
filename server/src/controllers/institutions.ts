import { Request, Response } from "express";
import { plaidClient } from "../config/plaid";
import { CountryCode, InstitutionsGetByIdRequest } from "plaid";

export default {
  // returns a single institution based on the id given by the client
  getInstitutionById: async (req: Request, res: Response) => {
    const { id } = req.params;
    const request: InstitutionsGetByIdRequest = {
      institution_id: id,
      country_codes: [CountryCode.Us],
      options: {
        include_optional_metadata: true,
      },
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
