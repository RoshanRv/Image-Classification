const fileInput = document.getElementById("file-input")
const image = document.getElementById("image")
const description = document.getElementById("prediction")

let model

// display result
function displayDescription(predictions) {
    console.log(predictions)
    // Sort by probability
    const result = predictions.sort((a, b) => a > b)[0]

    if (result.probability > 0.2) {
        const probability = Math.round(result.probability * 100)

        // Display result
        description.innerText = `${probability}% sure this is a ${result.className}  `
    } else description.innerText = "I am not sure what I should recognize 😢"
}

//  Classify with the image with the mobilenet model

function classifyImage() {
    model.classify(image).then((predictions) => {
        displayDescription(predictions)
    })
}

function getImage() {
    // Check if an image has been found in the input
    if (!fileInput.files[0]) throw new Error("Image not found")
    const file = fileInput.files[0]

    // Get the data url form the image
    const reader = new FileReader()

    reader.onload = function (event) {
        // console.log(event)
        const dataUrl = event.target.result

        const imageElement = new Image()
        imageElement.src = dataUrl

        imageElement.onload = function () {
            // Set <img /> attributes
            image.setAttribute("src", this.src)
            image.setAttribute("height", this.height)
            image.setAttribute("width", this.width)

            // Classify image
            classifyImage()
        }

        // Add the image-loaded class to the body
        document.body.classList.add("image-loaded")
    }

    // Get data URL
    reader.readAsDataURL(file)
}

mobilenet.load().then((m) => {
    model = m

    document.body.classList.remove("loading")

    fileInput.addEventListener("change", getImage)
})
