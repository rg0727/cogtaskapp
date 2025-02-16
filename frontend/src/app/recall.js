"use client";
import { useEffect, useRef } from 'react';
const fetch = require('node-fetch');
const fs = require('fs');
const { LumaAI } = require('lumaai');

const client = new LumaAI({ authToken: process.env.LUMAAI_API_KEY });

const Recall = () => {
    const [image, setImage] = useState('');
    const [iteratingPrompt, setIteratingPrompt] = useState('');

    const get5objects = () => {
        return "elephant dog pringles cookie bottle"
    }

    async function generateImage() {
        let generation = await client.generations.image.create({
            prompt: "Create an image with {}"
        });
    
        let completed = false;
    
        while (!completed) {
            generation = await client.generations.get(generation.id);
    
            if (generation.state === "completed") {
                completed = true;
            } else if (generation.state === "failed") {
                throw new Error(`Generation failed: ${generation.failure_reason}`);
            } else {
                console.log("Dreaming...");
                await new Promise(r => setTimeout(r, 3000)); // Wait for 3 seconds
            }
        }
    
        const imageUrl = generation.assets.image;
    
        const response = await fetch(imageUrl);
        console.log(imageUrl, response, "hella");

        setImage(imageUrl)
        const fileStream = fs.createWriteStream(`${generation.id}.jpg`);
        await new Promise((resolve, reject) => {
            response.body.pipe(fileStream);
            response.body.on('error', reject);
            fileStream.on('finish', resolve);
        });
        
        console.log(`File downloaded as ${generation.id}.jpg`);
    }

    async function generateInitialImage() {
        generateImage(get5objects())
    }

    async function generateConsequentImages() {
        generateImage(prompt)
    }

    useEffect(() => {
        generateInitialImage()
    }, [])

    return (
        <div>
            <img src={image}/>
            <button onClick={generateImage}>hehe</button>
            <input>foo</input>
        </div>
      );
}

export default Recall;