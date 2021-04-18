use grex::{Feature, RegExpBuilder};
use js_sys::Array;
use serde_json::Error;
use wasm_bindgen::prelude::*;
extern crate serde_json;

#[macro_use]
extern crate serde_derive;

#[derive(Serialize, Deserialize)]
struct Config {
    conversion_of: Option<Vec<String>>,
    syntax_highlighting: Option<bool>,
    minimum_repetitions: Option<u32>,
    escaped_non_ascii_chars_arg: Option<bool>,
    surrogate_pairs: Option<bool>,
    minimum_substring_length: Option<u32>,
}

#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

fn test_string(value: &JsValue) -> Option<String> {
    match value {
        value => {
            if value.is_string() {
                Some(value.as_string().unwrap())
            } else {
                None
            }
        }
    }
}

#[wasm_bindgen(js_name = buildRegex)]
pub fn build_regex(test_cases: Array, config: &JsValue) -> String {
    let mut test_cases_jsvalue_vec: Vec<JsValue> = test_cases.to_vec();
    test_cases_jsvalue_vec.dedup();
    let test_cases_vec: Vec<String> = test_cases_jsvalue_vec
        .iter()
        .map(|value| test_string(&value).unwrap())
        .collect();
    let mut regex_builder: RegExpBuilder = RegExpBuilder::from(&test_cases_vec);
    let config_option: Result<Config, Error> = config.into_serde::<Config>();
    match config_option {
        Ok(value) => {
            match value.conversion_of {
                Some(conversion_of) => {
                    let mut conversion_of_vec: Vec<String> = conversion_of.to_vec();
                    conversion_of_vec.dedup();
                    let mut feaute_vec = vec![];
                    for value in conversion_of_vec.iter() {
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
                                feaute_vec.push(value);
                            }
                            None => {}
                        };
                    }
                    regex_builder.with_conversion_of(&feaute_vec);
                }
                None => {}
            };
            match value.syntax_highlighting {
                Some(syntax_highlighting) => {
                    if syntax_highlighting {
                        regex_builder.with_syntax_highlighting();
                    }
                }
                None => {}
            }
            match value.minimum_repetitions {
                Some(minimum_repetitions) => {
                    regex_builder.with_minimum_repetitions(minimum_repetitions);
                }
                None => {}
            }
            match value.escaped_non_ascii_chars_arg {
                Some(escaped_non_ascii_chars) => {
                    if escaped_non_ascii_chars {
                        let mut use_surrogate: bool = false;
                        match value.surrogate_pairs {
                            Some(surrogate_pairs) => use_surrogate = surrogate_pairs,
                            None => {}
                        }
                        regex_builder.with_escaping_of_non_ascii_chars(use_surrogate);
                    }
                }
                None => {}
            }
            match value.minimum_substring_length {
                Some(minimum_substring_length) => {
                    regex_builder.with_minimum_substring_length(minimum_substring_length);
                }
                None => {}
            }
        }
        Err(_) => {}
    };
    regex_builder.build()
}
