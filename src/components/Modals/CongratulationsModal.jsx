import React from "react";
import UniversalModal from "./UniversalModal";

const CongratulationsModal = ({ targetPokemon, onClose, onNewGame, theme }) => {
    return (
        <UniversalModal
            targetPokemon={targetPokemon}
            onClose={onClose}
            onNewGame={onNewGame}
            theme={theme}
            titleText="You caught the Pokémon!"
            accentColor="green"
            buttonColor="green"
            shouldAnimate={true}
        />
    );
};

export default CongratulationsModal;
