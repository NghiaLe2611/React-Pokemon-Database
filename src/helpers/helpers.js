export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const convertPokemonInfo = (type, value) => {
    if (type === "W") {
        return (value/10 * 2.20462262).toFixed(2);
    } else if (type === "H") {
        const inches = Math.round (value*10/2.54)
        return Math.floor(inches / 12) + "′" + inches % 12 + "′′";
    }
}

export const formatStatString = (str) => {
    let result = '';
    if (str.indexOf('-') !== -1) {
        const stat = str.replace("-", " ");
        const values = stat.split(" ");

        values.forEach(val => {
            result += capitalizeFirstLetter(val) + " ";
        });

    } else {
        result = capitalizeFirstLetter(str);
    }

    return result;
}

export const convertPokemonId = (id) => {
    let pokemonId = `00${id}`;

    if (id.toString().length >= 2 && id.toString().length < 3) {
        pokemonId = `0${id}`
    }

    if (id.toString().length >= 3) {
        pokemonId = `${id}`
    }

    return pokemonId;
}

export const getLastStringSegment = (str) => {
    return str.split('/').filter(Boolean).pop();
}