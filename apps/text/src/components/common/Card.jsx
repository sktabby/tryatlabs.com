export function Card({ className = "", ...props }) {
  return <div className={`card ${className}`} {...props} />;
}

export function CardHeader({ className = "", ...props }) {
  return <div className={`card__header ${className}`} {...props} />;
}

export function CardTitle({ className = "", ...props }) {
  return <h2 className={`card__title ${className}`} {...props} />;
}

export function CardDesc({ className = "", ...props }) {
  return <p className={`card__desc ${className}`} {...props} />;
}

export function CardBody({ className = "", ...props }) {
  return <div className={`card__body ${className}`} {...props} />;
}

export function CardFooter({ className = "", ...props }) {
  return <div className={`card__footer ${className}`} {...props} />;
}
