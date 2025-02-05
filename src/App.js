import { useState, useEffect } from "react"
import "./App.css"

const App = () => {
  const [targetColor, setTargetColor] = useState("")
  const [colorOptions, setColorOptions] = useState([])
  const [gameStatus, setGameStatus] = useState("")
  const [score, setScore] = useState(0)
  const [trials, setTrials] = useState(3)
  const [isGameOver, setIsGameOver] = useState(false)
  const [selectedColor, setSelectedColor] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF"
    let color = "#"
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  const generateShade = (color, percent) => {
    const num = Number.parseInt(color.replace("#", ""), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = ((num >> 8) & 0x00ff) + amt,
      B = (num & 0x0000ff) + amt
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    )
  }

  const generateNewColors = () => {
    const newTargetColor = generateRandomColor()
    const newOptions = [newTargetColor]
    const shadePercentages = [-30, -20, -10, 10, 20]

    for (const percent of shadePercentages) {
      newOptions.push(generateShade(newTargetColor, percent))
    }

    setTargetColor(newTargetColor)
    setColorOptions(newOptions.sort(() => Math.random() - 0.5))
  }

  const startNewGame = () => {
    generateNewColors()
    setGameStatus("")
    setScore(0)
    setTrials(3)
    setIsGameOver(false)
    setSelectedColor("")
    setIsCorrect(false)
  }

  const handleGuess = (color) => {
    if (isGameOver) return

    setSelectedColor(color)

    if (color === targetColor) {
      setIsCorrect(true)
      setGameStatus("Correct!")
      setScore((prevScore) => prevScore + 1)
      setTrials(3) // Reset trials on correct guess
      setTimeout(() => {
        generateNewColors()
        setGameStatus("")
        setSelectedColor("")
        setIsCorrect(false)
      }, 1000)
    } else {
      setIsCorrect(false)
      const newTrials = trials - 1
      setTrials(newTrials)
      if (newTrials === 0) {
        setGameStatus("Game Over!")
        setIsGameOver(true)
      } else {
        setGameStatus(`Wrong, ${newTrials} ${newTrials === 1 ? "try" : "tries"} left!`)
      }
    }
  }

  useEffect(startNewGame, [])

  return (
    <div className="game-container">
      <div className="game-board">
        <h1 className="game-title">Color Guessing Game</h1>

        <div
          data-testid="colorBox"
          className={`color-box ${isCorrect ? "correct" : ""}`}
          style={{ backgroundColor: targetColor }}
        ></div>

        <p data-testid="gameInstructions" className="game-instructions">
          Guess the correct color shade!
        </p>

        <div className="color-options">
          {colorOptions.map((color, index) => (
            <button
              key={`${color}-${index}`}
              data-testid="colorOption"
              className={`color-option ${selectedColor === color && !isCorrect ? "wrong" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => handleGuess(color)}
              disabled={isGameOver}
            ></button>
          ))}
        </div>

        <p
          data-testid="gameStatus"
          className={`game-status ${
            gameStatus === "Correct!"
              ? "status-correct"
              : gameStatus === "Game Over!"
                ? "status-gameover"
                : "status-wrong"
          }`}
        >
          {gameStatus}
        </p>

        <p data-testid="score" className="score">
          Score: {score}
        </p>

        <button data-testid="newGameButton" className="new-game-button" onClick={startNewGame}>
          {isGameOver ? "Play Again" : "New Game"}
        </button>
      </div>
    </div>
  )
}

export default App
