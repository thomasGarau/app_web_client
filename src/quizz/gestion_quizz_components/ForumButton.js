import StyledButton from "../../composent/StyledBouton";

const ForumButton = ({ onClick }) => (
    <StyledButton
        onClick={onClick}
        width={200}
        color={'white'}
        content={"Forum"}
    />
);

export default ForumButton;
