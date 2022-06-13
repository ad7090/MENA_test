import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
// @ts-ignore
import { findAll } from 'highlight-words-core';

interface IProps {
    autoEscape?: boolean;
    highlightStyle?: StyleProp<TextStyle>;
    searchWords: string[];
    textToHighlight: string;
    sanitize?: (string: string) => string,
    style?: StyleProp<TextStyle>
}

const HighlightedText = ({
    autoEscape,
    highlightStyle,
    searchWords,
    textToHighlight,
    sanitize,
    style,
    ...props
}: IProps) => {
    const chunks = findAll({ textToHighlight, searchWords, sanitize, autoEscape });

    return (
        <Text style={style} {...props}>
            {chunks.map((chunk: any, index: number) => {
                const text = textToHighlight.substr(chunk.start, chunk.end - chunk.start);

                return (!chunk.highlight)
                    ? text
                    : (
                        <Text
                            key={index}
                            style={chunk.highlight && highlightStyle}
                        >
                            {text}
                        </Text>
                    );
            })}
        </Text>
    );
}

export default HighlightedText;
