export default {
  value: (req: Request) => req.headers['x-xsrf-token'] as string,
};
