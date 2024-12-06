const {Router} = require("express");

const router = Router();

router.get('/',);
router.get('/:id', getById);
router.get('/play', get3RandomPokemons);
router.post('/', createPokemon);
router.put('/', updatePokemon);
router.delete('/:id', deletePokemon);

module.exports = router;