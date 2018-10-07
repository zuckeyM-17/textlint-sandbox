/**
 * @param {RuleContext} context
 */
export default function (context) {
    const helper = new RuleHelper(context);
    const { Syntax, getSource, RuleError, report } = context; く
    return {
        [Syntax.Str](node) {
            const text = getSource(node);

            const match = text.match(/todo:/i);
            if (match) {
                report(
                    node,
                    new RuleError(`Found TODO: '${text}'`, {
                        index: match.index
                    })
                );
            }
        },
    };
}
