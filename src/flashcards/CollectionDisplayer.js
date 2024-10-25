import React, { useState } from 'react';
import { Box, Tabs, Tab, IconButton, Button } from '@mui/material';
import FlashcardsDisplayer from './FlashcardsDisplayer';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const CollectionDisplayer = () => {
    const [collections, setCollections] = useState([
        {
            id: 1, name: 'Collection 1', visibility: 'public', flashcards: [
                { recto: "au pif", verso: "Et ouais", isFlipped: false },
                { recto: "migate...", verso: "...no gokui", isFlipped: false },
                { recto: "Gear", verso: "5th", isFlipped: false },
            ]
        },
        {
            id: 2, name: 'Collection 2', visibility: 'private', flashcards: [
                { recto: "au pif", verso: "Et ouais", isFlipped: false },
                { recto: "Kamehame...", verso: "...HAAAAAAAAAA!!!!", isFlipped: false },
            ]
        },
    ]);

    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const updateCollectionFlashcards = (collectionId, updatedFlashcards) => {
        setCollections((prevCollections) =>
            prevCollections.map((collection) =>
                collection.id === collectionId
                    ? { ...collection, flashcards: updatedFlashcards }
                    : collection
            )
        );
    };

    const handleUpdateVisibility = (collectionId, newVisibility) => {
        setCollections((prevCollections) =>
            prevCollections.map((collection) =>
                collection.id === collectionId
                    ? { ...collection, visibility: newVisibility }
                    : collection
            )
        );
    };

    const addCollection = () => {
        const newCollection = {
            id: collections.length + 1,
            name: `Collection ${collections.length + 1}`,
            visibility: 'private',
            flashcards: []
        };
        setCollections([...collections, newCollection]);
        setSelectedTab(collections.length);
    };

    const deleteCollection = (collectionId) => {
        const updatedCollections = collections.filter(collection => collection.id !== collectionId);
        setCollections(updatedCollections);
        setSelectedTab((prevTab) => (prevTab >= updatedCollections.length ? 0 : prevTab));
    };

    return (
        <Box sx={{ width: '100%', position: 'relative', top: '150px' }}>
            {/* Les onglets pour chaque collection */}
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ marginBottom: 2, borderBottom: 1, borderColor: 'divider' }}
            >
                {collections.map((collection) => (
                    <Tab wrapped key={collection.id} label={collection.name} />
                ))}
                <Tab
                    icon={<AddIcon style={{ fill: "#000" }} />}
                    onClick={addCollection}
                    aria-label="Add Collection"
                />
            </Tabs>


            {/* Affichage des flashcards de la collection sélectionnée */}
            {collections.map((collection, index) => (
                <Box
                    key={collection.id}
                    role="tabpanel"
                    hidden={selectedTab !== index}
                >
                    {collections[selectedTab] && (
                        <FlashcardsDisplayer
                            flashCardsList={collections[selectedTab].flashcards}
                            collectionName={collections[selectedTab].name}
                            collectionId={collections[selectedTab].id}
                            onUpdateFlashcards={updateCollectionFlashcards}
                            visibility={collections[selectedTab].visibility}
                            onUpdateVisibility={handleUpdateVisibility}
                            deleteCollection={deleteCollection}
                        />
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default CollectionDisplayer;
