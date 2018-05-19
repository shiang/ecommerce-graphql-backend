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
        updateVendor: async (parent, args, { Vendor }) => {
            const vendor = await Vendor.findOneAndUpdate(
                { _id: args._id },
                args.vendorInput,
                { new: true }
            );

            return vendor;
        },
        removeVendor: async (parent, args, { Vendor }) => {
            const vendor = await Vendor.findByIdAndRemove({ _id: args._id });

            return vendor;
        },
    },
    Vendor: {
        products: async (vendor, _, { Product }) => {
            const products = await Product.find()
                .where("vendor")
                .equals(vendor._id)
                .exec();

            return products;
        },
        pictures: async (vendor, _, { Picture }) => {
            const pictures = await Picture.find()
                .where("vendor")
                .equals(vendor._id)
                .exec();

            return pictures;
        },
        likedBy: async (vendor, _, { Customer }) => {
            const likedBys = await Customer.find()
                .where("likedVendors")
                .equals(vendor._id)
                .exec();

            return likedBys;
        },
        orders: async (vendor, _, { Order }) => {
            const orders = await Order.find()
                .where("vendor")
                .equals(vendor._id)
                .exec();

            return orders;
        },
        user: async (vendor, _, { User }) => {
            const user = await User.findById({ _id: vendor.user });

            return user;
        },
        chats: async (vendor, _, { Chatroom }) => {
            const chats = await Chatroom.find()
                .where("vendor")
                .equals(vendor._id)
                .exec()

            return chats;
        }
    },
}