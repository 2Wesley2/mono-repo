function logger(methodName, ...args) {
  const prefix = `[${methodName.toUpperCase()}]:`;
  const formattedArgs = args.map((arg) =>
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg,
  );
  const message = `${prefix} ${formattedArgs.join(' ')}`;
  console.log(message);
}

export default logger;
