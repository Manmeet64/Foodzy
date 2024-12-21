import React, { useState } from "react";
import Sentiment from "sentiment";
import { motion, AnimatePresence } from "framer-motion";
import styled from "@emotion/styled";
import { RiSendPlaneFill } from "react-icons/ri";
import Navbar from "../../components/Navbar/Navbar";
import Dish from "../../components/Dish/Dish";
import useFirebaseIdToken from "../../Hooks/useFirebaseIdToken";

const MainContainer = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

const PageContainer = styled.div`
    flex: 1;
    background-color: #f9fbef;
    display: flex;
    align-items: ${(props) => (props.isSubmitted ? "flex-start" : "center")};
    justify-content: center;
    padding: 2rem;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

const SearchContainer = styled(motion.div)`
    width: 100%;
    max-width: ${(props) => (props.isSubmitted ? "800px" : "650px")};
    padding: ${(props) => (props.isSubmitted ? "20px" : "0")};
    position: relative;
    z-index: 1;
    margin-top: ${(props) => (props.isSubmitted ? "80px" : "0")};
    transition: margin-top 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

const InputWrapper = styled(motion.div)`
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
`;

const Input = styled(motion.input)`
    width: 100%;
    padding: 24px 30px;
    padding-right: 70px;
    font-size: ${(props) => (props.isSubmitted ? "18px" : "20px")};
    border: none;
    border-radius: 28px;
    background: white;
    box-shadow: 0 4px 20px rgba(94, 135, 119, 0.15);
    outline: none;
    transition: all 0.3s ease;
    color: #2d3436;

    &:focus {
        box-shadow: 0 6px 24px rgba(94, 135, 119, 0.2);
    }
`;

const SendButton = styled(motion.button)`
    position: absolute;
    right: 12px;
    width: 44px;
    height: 44px;
    background: #5e8777;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 2;

    svg {
        font-size: 20px;
        transition: transform 0.3s ease;
    }

    &:hover {
        background: #4a7056;
        box-shadow: 0 4px 12px rgba(94, 135, 119, 0.3);

        svg {
            transform: translateX(2px);
        }
    }
`;

const HeadingContainer = styled(motion.div)`
    text-align: center;
    margin-bottom: 24px;
    perspective: 1000px;
`;

const InitialPrompt = styled(motion.h1)`
    color: #2d3436;
    font-size: ${(props) => (props.isSubmitted ? "38px" : "32px")};
    font-weight: 800;
    text-align: center;
    margin: 0;
    background: linear-gradient(135deg, #2d3436 0%, #5e8777 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 10px rgba(94, 135, 119, 0.1);
`;

const ResultsContainer = styled(motion.div)`
    width: 100%;
    margin-top: 40px;
`;

const DishesGrid = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    margin-top: 40px;
    padding: 20px;
`;

const DishWrapper = styled(motion.div)`
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(94, 135, 119, 0.1);
`;

const FollowUpMessage = styled(motion.h2)`
    color: #2d3436;
    font-size: 28px;
    font-weight: 800;
    text-align: center;
    margin: 40px 0;
    background: linear-gradient(135deg, #2d3436 0%, #5e8777 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
    text-shadow: 0 2px 10px rgba(94, 135, 119, 0.1);
`;

const Aura = () => {
    const [inputText, setInputText] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentMood, setCurrentMood] = useState("");
    const [dishes, setDishes] = useState([]);
    const [followUpMessage, setFollowUpMessage] = useState("");
    const idToken = useFirebaseIdToken();
    const sentiment = new Sentiment();

    const moodMessages = {
        happy: [
            "Yay! You're in a great mood! How about some sweet treats to match your vibe? 😄🍰",
            "Feeling happy? Let's keep the good times rolling with some delicious dishes that'll add extra joy to your day! 🎉🍔",
        ],
        sad: [
            "Oh no, feeling a bit down? Don't worry, comfort food is here to lift your spirits. 🥺🍲",
            "We all have those days. How about a warm, cozy meal to brighten things up? 🌧️🍜",
        ],
        angry: [
            "Feeling fired up? Let's channel that energy into something spicy and satisfying! 🔥🍛",
            "Anger in the air? Time for something bold, hot, and spicy to cool you off! 😤🌶️",
        ],
        romantic: [
            "Ah, love is in the air! Let's indulge in some delicious dishes that'll set the mood right. 💕🍝",
            "What's better than a romantic meal for two? Let's dive into some passion-filled flavors! 🍷🍽️",
        ],
        anxious: [
            "A little anxious? Let's go for something calming and soothing to ease the nerves. 🍵🍃",
            "Take a deep breath and enjoy a peaceful, healthy meal to ground yourself. 🧘‍♀️🥗",
        ],
        depressed: [
            "Feeling a bit low? Comfort food is just what you need to lift your mood! 🍟🍰",
            "Everyone needs a treat sometimes. Indulge in something fried and comforting to feel better. 🍕🍔",
        ],
        excited: [
            "Yay! You're buzzing with energy! Let's fuel that excitement with something fresh and vibrant! 🌟🥗",
            "Ready for some flavor-packed dishes to match your excitement? Let's make it a party! 🎉🍣",
        ],
        nostalgic: [
            "Ah, reminiscing the good old days? Let's dive into some traditional, comforting dishes that'll bring back memories! 🏡🍲",
            "Craving something that reminds you of home? We've got all the classic dishes just for you. 🥰🍛",
        ],
        energetic: [
            "Your energy is off the charts! Let's power up with a healthy, protein-packed dish. 💪🥑",
            "Need fuel for your day? Let's go for something packed with protein and nutrients! 🏋️‍♀️🍳",
        ],
        cozy: [
            "Snuggling up for the day? Let's make it extra cozy with something warm and comforting. ☕🍲",
            "Warm, comforting meals are the best way to unwind. How about a hot bowl of your favorite dish? 🛋️🍛",
        ],
    };

    const analyzeMood = (text) => {
        const result = sentiment.analyze(text);
        const categories = {
            happy: [
                "happy",
                "joy",
                "delight",
                "positive",
                "cheerful",
                "elated",
                "content",
                "good",
                "great",
                "blessed",
                "lit",
                "vibing",
                "hyped",
                "yass",
                "grateful",
                "feeling amazing",
            ],
            sad: [
                "sad",
                "down",
                "depressed",
                "unhappy",
                "negative",
                "blue",
                "gloomy",
                "low",
                "heartbroken",
                "mournful",
                "empty",
                "crushed",
                "broken",
                "meh",
                "comfort food",
                "feeling low",
            ],
            angry: [
                "angry",
                "mad",
                "furious",
                "irritated",
                "frustrated",
                "annoyed",
                "enraged",
                "livid",
                "fuming",
                "rage",
                "pissed",
                "heated",
                "triggered",
                "salty",
                "spicy",
                "fiery",
                "hot",
            ],
            romantic: [
                "love",
                "romantic",
                "affection",
                "passion",
                "adoring",
                "caring",
                "sweetheart",
                "heart",
                "fond",
                "crush",
                "intimate",
                "bae",
                "couple goals",
                "romantic date",
                "lovebirds",
                "dessert",
                "wine",
            ],
            anxious: [
                "anxious",
                "nervous",
                "uneasy",
                "worried",
                "restless",
                "jittery",
                "tense",
                "on edge",
                "stressed",
                "overwhelmed",
                "apprehensive",
                "paranoid",
                "uncertain",
                "freaking out",
                "salad",
                "smoothie",
                "light",
            ],
            depressed: [
                "depressed",
                "indulgent",
                "fried",
                "dessert",
                "cake",
                "miserable",
                "hopeless",
                "empty",
                "low",
                "downhearted",
                "feeling empty",
                "slipping",
                "burned out",
                "in a funk",
                "mentally drained",
                "comfort food",
            ],
            excited: [
                "excited",
                "energetic",
                "fresh",
                "energetic",
                "adventurous",
                "thrilled",
                "ecstatic",
                "pumped",
                "eager",
                "rushed",
                "hyped",
                "lit",
                "ready",
                "can't wait",
                "sushi",
                "wrap",
                "taco",
                "fruit",
            ],
            nostalgic: [
                "nostalgic",
                "traditional",
                "homemade",
                "classic",
                "authentic",
                "grandma",
                "vintage",
                "old",
                "sentimental",
                "memories",
                "throwback",
                "feels",
                "retro",
                "old school",
                "good old days",
                "comfort",
            ],
            energetic: [
                "energetic",
                "active",
                "protein",
                "bar",
                "bowl",
                "shake",
                "nuts",
                "vigorous",
                "lively",
                "dynamic",
                "fit",
                "strong",
                "workout",
                "gym",
                "hustle",
                "go-getter",
                "active vibes",
                "healthy",
            ],
            cozy: [
                "cozy",
                "warm",
                "hot chocolate",
                "soup",
                "latte",
                "stew",
                "comfy",
                "snug",
                "blanket",
                "chilly",
                "relaxed",
                "homey",
                "chill vibes",
                "cuddly",
                "self-care",
                "cozy vibes",
                "latte",
            ],
            craving: [
                "craving",
                "hungry",
                "starving",
                "want",
                "yearning",
                "feeling like",
                "need",
                "itching for",
                "desire",
                "looking for",
                "must have",
                "in the mood for",
                "longing",
                "taste for",
            ],
        };

        let mood = "neutral";

        for (const [key, words] of Object.entries(categories)) {
            if (words.some((word) => text.toLowerCase().includes(word))) {
                mood = key;
                break;
            }
        }
        console.log("Mood detected:", mood);
        return mood;
    };

    const getRandomMessage = (mood) => {
        const messages = moodMessages[mood];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    const fetchMoodDishes = async (mood) => {
        try {
            const response = await fetch(
                `http://localhost:8000/menus/mood/${mood}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Server responded with ${response.status}: ${errorText}`
                );
            }

            const data = await response.json();
            if (data.dishes && Array.isArray(data.dishes)) {
                console.log("Dishes fetched:", data.dishes);
                setDishes(data.dishes);
            } else {
                console.error("Unexpected data format:", data);
                setDishes([]);
            }
        } catch (error) {
            console.error("Error fetching mood dishes:", error);
            setDishes([]);
        }
    };

    const handleSubmit = async () => {
        if (!inputText.trim()) return;

        const detectedMood = analyzeMood(inputText);
        setCurrentMood(detectedMood);
        setFollowUpMessage(getRandomMessage(detectedMood));

        if (!isSubmitted) {
            setIsSubmitted(true);
        }

        await fetchMoodDishes(detectedMood);
        setInputText("");
    };

    const containerVariants = {
        initial: {
            y: 0,
            scale: 0.95,
            opacity: 0,
        },
        animate: {
            y: isSubmitted ? -200 : 0,
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                mass: 1,
            },
        },
    };

    const headingVariants = {
        initial: {
            opacity: 0,
            y: -20,
            rotateX: -30,
        },
        animate: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
            },
        },
        submitted: {
            scale: 1.1,
            y: -10,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
            },
        },
    };

    return (
        <MainContainer>
            <Navbar />
            <PageContainer isSubmitted={isSubmitted}>
                <SearchContainer
                    variants={containerVariants}
                    initial="initial"
                    animate="animate"
                    isSubmitted={isSubmitted}
                >
                    <HeadingContainer>
                        <InitialPrompt
                            variants={headingVariants}
                            initial="initial"
                            animate={isSubmitted ? "submitted" : "animate"}
                            isSubmitted={isSubmitted}
                        >
                            How are you feeling today?
                        </InitialPrompt>
                    </HeadingContainer>

                    <InputWrapper>
                        <Input
                            isSubmitted={isSubmitted}
                            placeholder="Share your thoughts..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleSubmit()
                            }
                            whileFocus={{ scale: 1.01 }}
                        />
                        <SendButton
                            onClick={handleSubmit}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <RiSendPlaneFill />
                        </SendButton>
                    </InputWrapper>

                    <AnimatePresence>
                        {isSubmitted && followUpMessage && (
                            <ResultsContainer>
                                <FollowUpMessage
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 20,
                                        delay: 0.2,
                                    }}
                                >
                                    {followUpMessage}
                                </FollowUpMessage>

                                {dishes && dishes.length > 0 && (
                                    <DishesGrid
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {dishes.map((dish, index) => (
                                            <DishWrapper
                                                key={dish.id || index}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: index * 0.1,
                                                    type: "spring",
                                                    stiffness: 100,
                                                    damping: 20,
                                                }}
                                            >
                                                <Dish
                                                    {...dish}
                                                    restaurantId={
                                                        dish.restaurantId._id
                                                    }
                                                />
                                            </DishWrapper>
                                        ))}
                                    </DishesGrid>
                                )}
                            </ResultsContainer>
                        )}
                    </AnimatePresence>
                </SearchContainer>
            </PageContainer>
        </MainContainer>
    );
};

export default Aura;
