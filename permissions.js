const createResolver = (resolver) => {
    const baseResolver = resolver;
    baseResolver.createResolver = (childResolver) => {
        const newResolver = async (parent, args, context) => {
            await resolver(parent, args, context);
            return childResolver(parent, args, context);
        }
        return createResolver(childResolver);
    }
    return baseResolver;
};

export const requiresAuth = createResolver((parent, args, context) => {
    if(!context.user) {
        throw new Error('Not authenticated');
    }
});


