import { useContext, useState } from "react";
import { QuizContext } from "../../../util/Contexts";

import { 
  Box,
  Input, 
  InputGroup,
  InputLeftElement
} from "@chakra-ui/react";

import { LuSearchCheck } from "react-icons/lu";


const Searchbar = () => {
  const {
    setCategories,
    searchTerm,
    setSearchTerm
  } = useContext(QuizContext);

  const quickPlay = (cat) => {
    if (window.gtag) {
      window.gtag('event', 'quick_play', {
        event_category: 'engagement',
        event_label: 'Quick Play Button',
        value: 1
      });
    }

    setCategories(cat.name)
  }; 

  const botMode = (cat) => {
    if (window.gtag) {
      window.gtag('event', 'bot_mode', {
        event_category: 'engagement',
        event_label: 'Bot Mode Button',
        value: 1
      });
    }

    setCategories(cat.name)
  }; 


  return (
    <Box>
        <div className="top-bar">
            <InputGroup>
            <InputLeftElement pointerEvents="none">
                <LuSearchCheck />
            </InputLeftElement>
            <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search categories"
                placeholder="Search..." 
            />
            </InputGroup>
        </div>
    </Box>
  )
}

export default Searchbar