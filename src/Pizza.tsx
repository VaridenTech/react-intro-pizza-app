type PizzaProps = {
  name: string;
  description: string;
  image: string;
};

const Pizza = (props: PizzaProps) => {
  return (
    <div className="pizza">
      <h1>{props.name}</h1>
      <p>{props.description}</p>
      <img src={props.image} alt={props.name} />
    </div>
  );
};

export default Pizza;
