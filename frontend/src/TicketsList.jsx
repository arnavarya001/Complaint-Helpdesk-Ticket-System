import React from 'react';

function TicketsList({ tickets }) {
    return (
        <div style={styles.container}>
            {tickets.map((item) => (
                <div key={item.id} style={styles.card}>
                    <img
                        src={item.thumbnail}
                        alt={item.title}
                        style={styles.image}
                    />

                    <div style={styles.content}>
                        <span style={styles.category}>
                            {item.category}
                        </span>

                        <h2 style={styles.title}>
                            {item.title}
                        </h2>

                        <p style={styles.brand}>
                            Brand: <strong>{item.brand}</strong>
                        </p>

                        <p style={styles.description}>
                            {item.description}
                        </p>

                        <div style={styles.details}>
                            <span>⭐ {item.rating}</span>
                            <span>📦 {item.stock} left</span>
                        </div>

                        <div style={styles.bottom}>
                            <h2 style={styles.price}>
                                ${item.price}
                            </h2>

                            <button style={styles.button}>
                                Action
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

const styles = {
    container: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
        padding: '30px',
        backgroundColor: '#f5f5f5',
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: '15px',
        overflow: 'hidden',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
        transition: '0.3s',
    },

    image: {
        width: '100%',
        height: '220px',
        objectFit: 'contain',
        backgroundColor: '#fafafa',
        padding: '15px',
        boxSizing: 'border-box',
    },

    content: {
        padding: '20px',
    },

    category: {
        backgroundColor: '#eee',
        color: '#555',
        padding: '5px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        textTransform: 'uppercase',
    },

    title: {
        fontSize: '22px',
        margin: '15px 0 8px',
        color: '#222',
    },

    brand: {
        color: '#666',
        margin: '5px 0',
    },

    description: {
        color: '#777',
        fontSize: '14px',
        lineHeight: '1.6',
    },

    details: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '15px 0',
        color: '#555',
        fontSize: '14px',
    },

    bottom: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    price: {
        color: '#e63946',
        margin: 0,
    },

    button: {
        backgroundColor: '#111',
        color: '#fff',
        border: 'none',
        padding: '10px 18px',
        borderRadius: '8px',
        cursor: 'pointer',
    },
};

export default TicketsList;
