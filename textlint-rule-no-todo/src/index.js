/**
 * @param {RuleContext} context
 */
export default function (context) {
    const { Syntax, getSource, RuleError, report } = context;
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
        [Syntax.ListItem](node) {
            const text = context.getSource(node);
            const match = text.match(/\[\s+\]\s/i);
            if (match) {
                report(
                    node,
                    new context.RuleError(`Found TODO: '${text}'`, {
                        index: match.index
                    })
                );
            }
        }
    };
}
