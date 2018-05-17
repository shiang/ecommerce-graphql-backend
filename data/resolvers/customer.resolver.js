export default {
    Query: {
        customer: async (parent, args, { Customer }) => {
            const customer = await Customer.findOne({ _id: args._id });
            return customer;
        },
        allCustomers: async (parent, args, { Customer }) => {
            const customers = await Customer.find();
            return customers.map(customer => {
                customer._id = customer._id.toString();
                return customer;
            });
        },
    },
    Mutation: {
        createCustomer: async (parent, { customerInput }, { Customer }) => {
            const customer = await new Customer(customerInput).save();
            customer._id = customer._id.toString();
            return customer;
        },
        updateCustomer: async (parent, { customerInput }, { Customer }) => {
            const customer = await Customer.findOneAndUpdate(
                { _id: args._id },
                customerInput,
                { new: true }
            );

            return customer;
        },
        removeCustomer: async (parent, args, { Customer }) => {
            const customer = await Customer.findByIdAndRemove({ _id: args._id });

            return customer;
        },
        addToCart: async (parent, args, { Customer, OrderInfo }) => {

            const orderInfo = await new OrderInfo(args).save();
            await Customer.findByIdAndUpdate(
                args.orderedBy,
                { $push: { "cart": orderInfo._id } },
                { new: true }
            );

            return orderInfo;

        }
    }
}