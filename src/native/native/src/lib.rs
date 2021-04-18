use grex::{Feature, RegExpBuilder};
use neon::prelude::*;

fn build_regex(mut cx: FunctionContext) -> JsResult<JsString> {
    let test_caces = cx.argument::<JsArray>(0)?.to_vec(&mut cx)?;
    let mut native_test_caces: Vec<String> = vec![];
    for value in test_caces.iter() {
        let value = value.downcast::<JsString>().or_throw(&mut cx)?.value();
        native_test_caces.push(value);
    }
    let mut regex_builder = RegExpBuilder::from(&native_test_caces);
    match cx.argument_opt(1) {
        Some(config) => {
            let config = config.downcast::<JsObject>().or_throw(&mut cx)?;
            let conversion_arg = config.get(&mut cx, "conversionOf");
            match conversion_arg {
                Ok(value) => {
                    if value.is_a::<JsArray>() {
                        let mut temp_conversion = value
                            .downcast::<JsArray>()
                            .or_throw(&mut cx)?
                            .to_vec(&mut cx)?;
                        temp_conversion.dedup();
                        let mut conversion = vec![];
                        for value in temp_conversion.iter() {
                            let value = value.downcast::<JsString>().or_throw(&mut cx)?.value();
                            let enum_value_option = match value.as_str() {
                                "digit" => Some(Feature::Digit),
                                "noDigit" => Some(Feature::NonDigit),
                                "space" => Some(Feature::Space),
                                "noSpace" => Some(Feature::NonSpace),
                                "word" => Some(Feature::Word),
                                "noWord" => Some(Feature::NonWord),
                                "repetition" => Some(Feature::Repetition),
                                "caseInsensitivity" => Some(Feature::CaseInsensitivity),
                                "capturingGroup" => Some(Feature::CapturingGroup),
                                _ => None,
                            };
                            match enum_value_option {
                                Some(value) => {
                                    conversion.push(value);
                                }
                                None => (),
                            }
                        }
                        regex_builder.with_conversion_of(&conversion);
                    }
                }
                Err(_) => (),
            }
            let syntax_highlight_arg = config.get(&mut cx, "syntaxHighlighting");
            match syntax_highlight_arg {
                Ok(value) => {
                    if value.is_a::<JsBoolean>() {
                        let syntax_highlight =
                            value.downcast::<JsBoolean>().or_throw(&mut cx)?.value();
                        if syntax_highlight {
                            regex_builder.with_syntax_highlighting();
                        }
                    }
                }
                Err(_) => (),
            }
            let with_minimum_repetitions_arg = config.get(&mut cx, "minimumRepetitions");
            match with_minimum_repetitions_arg {
                Ok(value) => {
                    if value.is_a::<JsNumber>() {
                        let with_minimum_repetitions =
                            value.downcast::<JsNumber>().or_throw(&mut cx)?.value();
                        regex_builder.with_minimum_repetitions(with_minimum_repetitions as u32);
                    }
                }
                Err(_) => (),
            }
            let with_escaped_non_ascii_chars_arg = config.get(&mut cx, "escapedNonASCIIChars");
            let use_surrogate_pairs_arg = config.get(&mut cx, "surrogatePairs");
            match with_escaped_non_ascii_chars_arg {
                Ok(value) => {
                    if value.is_a::<JsBoolean>() {
                        let with_escaped_non_ascii_chars =
                            value.downcast::<JsBoolean>().or_throw(&mut cx)?.value();
                        let mut use_surrogate: bool = false;
                        match use_surrogate_pairs_arg {
                            Ok(value) => {
                                if value.is_a::<JsBoolean>() {
                                    use_surrogate =
                                        value.downcast::<JsBoolean>().or_throw(&mut cx)?.value();
                                }
                            }
                            Err(_) => (),
                        };
                        if with_escaped_non_ascii_chars {
                            regex_builder.with_escaping_of_non_ascii_chars(use_surrogate);
                        }
                    }
                }
                Err(_) => (),
            }
            let with_minimum_substring_length_arg = config.get(&mut cx, "minimumSubstringLength");
            match with_minimum_substring_length_arg {
                Ok(value) => {
                    if value.is_a::<JsNumber>() {
                        let with_minimum_substring_length =
                            value.downcast::<JsNumber>().or_throw(&mut cx)?.value();
                        regex_builder
                            .with_minimum_substring_length(with_minimum_substring_length as u32);
                    }
                }
                Err(_) => (),
            }
        }
        None => (),
    }
    let regexp = regex_builder.build();
    Ok(cx.string(regexp))
}

register_module!(mut cx, { cx.export_function("buildRegex", build_regex) });
