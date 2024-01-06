"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plaid_1 = require("../config/plaid");
const plaid_2 = require("plaid");
exports.default = {
    // returns a single institution based on the id given by the client
    getInstitutionById: async (req, res) => {
        const { id } = req.params;
        const request = {
            institution_id: id,
            country_codes: [plaid_2.CountryCode.Us],
            options: {
                include_optional_metadata: true,
            },
        };
        try {
            const { data } = await plaid_1.plaidClient.institutionsGetById(request);
            res.status(200).json(data);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error fetching institution data" });
        }
    },
};
//# sourceMappingURL=institutions.js.map