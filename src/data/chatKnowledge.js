export const getBotResponse = (input) => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('namaste')) {
        return "Namaste! 🙏 How can I help you grow your wealth today?";
    }

    if (lowerInput.includes('save') || lowerInput.includes('invest')) {
        return "You can start saving with just ₹10! 💰 It goes into 100% safe Government Bonds.";
    }

    if (lowerInput.includes('safe') || lowerInput.includes('risk')) {
        return "Yes! Your money is held in Government of India bonds. It is 100% secure. 🛡️";
    }

    if (lowerInput.includes('withdraw') || lowerInput.includes('money back')) {
        return "You can withdraw anytime! 💸 The money reaches your bank account in 24 hours.";
    }

    if (lowerInput.includes('interest') || lowerInput.includes('return')) {
        return "You earn around 6-7% annual interest, better than a savings account! 📈";
    }

    if (lowerInput.includes('bond')) {
        return "A bond is a loan you give to the Government. They pay you back with interest. It's very safe. 🏛️";
    }

    return "I'm not sure about that. Try asking 'How to save?' or 'Is it safe?'. (I am currently offline 📶)";
};
