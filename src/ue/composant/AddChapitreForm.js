import { TextField, Popover, Typography, Box } from '@mui/material';
import StyledButton from '../../composent/StyledBouton';

function AddChapitreForm({ nom, setNom, handleCreateChap, errorAnchorEl, open, handleClosePopover, errorMessage }) {
    return (
        <div className='create-chapitre-form'>
            <Box display="flex" flexWrap="wrap" alignItems="center" width="50%" padding="10px">
                <TextField
                    label='Nom du chapitre'
                    aria-describedby='nom'
                    type="text"
                    id='nom'
                    className='form-input'
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                />
            </Box>
            <StyledButton
                content={"Ajouter"}
                width={200}
                color={"primary"}
                onClick={handleCreateChap}
            />
            <Popover
                open={open}
                anchorEl={errorAnchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Typography sx={{ p: 2 }}>{errorMessage}</Typography>
            </Popover>
        </div>
    );
}

export default AddChapitreForm;
