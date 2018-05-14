export default {
    Query: {
        vendor: async (parent, args, { Vendor }) => {
            const vendor = await Vendor.findOne({ _id: args._id });
            return vendor;
        },
        allVendors: async (parent, args, { Vendor }) => {
            const vendors = await Vendor.find();
            return vendors.map(vendor => {
                vendor._id = vendor._id.toString();
                return vendor;
            });
        }
    },
    Mutation: {
        createVendor: async (parent, { vendorInput }, { Vendor }) => {
            const vendor = await new Vendor(vendorInput).save();
            vendor._id = vendor._id.toString();
            return vendor;
        },
        updateVendor: async (parent, { vendorInput }, { Vendor }) => {
            const vendor = await Vendor.findOneAndUpdate(
                { _id: args._id },
                vendorInput,
                { new: true }
            );

            return vendor;
        },
        removeVendor: async (parent, args, { Vendor }) => {
            const vendor = await Vendor.findByIdAndRemove({ _id: args._id });

            return vendor;
        },
    }
}