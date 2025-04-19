import React from "react";
import UniversalModal from "./UniversalModal";

const GiveUpModal = ({ targetPokemon, onClose, onNewGame, theme }) => {
    return (
        <UniversalModal
            targetPokemon={targetPokemon}
            onClose={onClose}
            onNewGame={onNewGame}
            theme={theme}
            titleText="The Pokémon was..."
            accentColor="red"
            buttonColor="red"
            shouldAnimate={true}
        />
    );
};

export default GiveUpModal;
