import { buildAnimationAst } from '../dsl/animation_ast_builder';
import { buildTrigger } from '../dsl/animation_trigger';
import { triggerBuildFailed } from '../error_helpers';
import { warnTriggerBuild } from '../warning_helpers';
import { parseTimelineCommand } from './shared';
import { TimelineAnimationEngine } from './timeline_animation_engine';
import { TransitionAnimationEngine } from './transition_animation_engine';
export class AnimationEngine {
    constructor(doc, _driver, _normalizer) {
        this._driver = _driver;
        this._normalizer = _normalizer;
        this._triggerCache = {};
        // this method is designed to be overridden by the code that uses this engine
        this.onRemovalComplete = (element, context) => { };
        this._transitionEngine = new TransitionAnimationEngine(doc.body, _driver, _normalizer);
        this._timelineEngine = new TimelineAnimationEngine(doc.body, _driver, _normalizer);
        this._transitionEngine.onRemovalComplete = (element, context) => this.onRemovalComplete(element, context);
    }
    registerTrigger(componentId, namespaceId, hostElement, name, metadata) {
        const cacheKey = componentId + '-' + name;
        let trigger = this._triggerCache[cacheKey];
        if (!trigger) {
            const errors = [];
            const warnings = [];
            const ast = buildAnimationAst(this._driver, metadata, errors, warnings);
            if (errors.length) {
                throw triggerBuildFailed(name, errors);
            }
            if (warnings.length) {
                warnTriggerBuild(name, warnings);
            }
            trigger = buildTrigger(name, ast, this._normalizer);
            this._triggerCache[cacheKey] = trigger;
        }
        this._transitionEngine.registerTrigger(namespaceId, name, trigger);
    }
    register(namespaceId, hostElement) {
        this._transitionEngine.register(namespaceId, hostElement);
    }
    destroy(namespaceId, context) {
        this._transitionEngine.destroy(namespaceId, context);
    }
    onInsert(namespaceId, element, parent, insertBefore) {
        this._transitionEngine.insertNode(namespaceId, element, parent, insertBefore);
    }
    onRemove(namespaceId, element, context) {
        this._transitionEngine.removeNode(namespaceId, element, context);
    }
    disableAnimations(element, disable) {
        this._transitionEngine.markElementAsDisabled(element, disable);
    }
    process(namespaceId, element, property, value) {
        if (property.charAt(0) == '@') {
            const [id, action] = parseTimelineCommand(property);
            const args = value;
            this._timelineEngine.command(id, element, action, args);
        }
        else {
            this._transitionEngine.trigger(namespaceId, element, property, value);
        }
    }
    listen(namespaceId, element, eventName, eventPhase, callback) {
        // @@listen
        if (eventName.charAt(0) == '@') {
            const [id, action] = parseTimelineCommand(eventName);
            return this._timelineEngine.listen(id, element, action, callback);
        }
        return this._transitionEngine.listen(namespaceId, element, eventName, eventPhase, callback);
    }
    flush(microtaskId = -1) {
        this._transitionEngine.flush(microtaskId);
    }
    get players() {
        return [...this._transitionEngine.players, ...this._timelineEngine.players];
    }
    whenRenderingDone() {
        return this._transitionEngine.whenRenderingDone();
    }
    afterFlushAnimationsDone(cb) {
        this._transitionEngine.afterFlushAnimationsDone(cb);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2VuZ2luZV9uZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvYW5pbWF0aW9uX2VuZ2luZV9uZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVVBLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQy9ELE9BQU8sRUFBbUIsWUFBWSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFFeEUsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDcEQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFHcEQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQzlDLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ3BFLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBRXhFLE1BQU0sT0FBTyxlQUFlO0lBUzFCLFlBQ0UsR0FBYSxFQUNMLE9BQXdCLEVBQ3hCLFdBQXFDO1FBRHJDLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBQ3hCLGdCQUFXLEdBQVgsV0FBVyxDQUEwQjtRQVJ2QyxrQkFBYSxHQUFzQyxFQUFFLENBQUM7UUFFOUQsNkVBQTZFO1FBQ3RFLHNCQUFpQixHQUFHLENBQUMsT0FBWSxFQUFFLE9BQVksRUFBRSxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBTzVELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLHlCQUF5QixDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVu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bnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuZGV2L2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtBbmltYXRpb25NZXRhZGF0YSwgQW5pbWF0aW9uUGxheWVyLCBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGF9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuXG5pbXBvcnQge1RyaWdnZXJBc3R9IGZyb20gJy4uL2RzbC9hbmltYXRpb25fYXN0JztcbmltcG9ydCB7YnVpbGRBbmltYXRpb25Bc3R9IGZyb20gJy4uL2RzbC9hbmltYXRpb25fYXN0X2J1aWxkZXInO1xuaW1wb3J0IHtBbmltYXRpb25UcmlnZ2VyLCBidWlsZFRyaWdnZXJ9IGZyb20gJy4uL2RzbC9hbmltYXRpb25fdHJpZ2dlcic7XG5pbXBvcnQge0FuaW1hdGlvblN0eWxlTm9ybWFsaXplcn0gZnJvbSAnLi4vZHNsL3N0eWxlX25vcm1hbGl6YXRpb24vYW5pbWF0aW9uX3N0eWxlX25vcm1hbGl6ZXInO1xuaW1wb3J0IHt0cmlnZ2VyQnVpbGRGYWlsZWR9IGZyb20gJy4uL2Vycm9yX2hlbHBlcnMnO1xuaW1wb3J0IHt3YXJuVHJpZ2dlckJ1aWxkfSBmcm9tICcuLi93YXJuaW5nX2hlbHBlcnMnO1xuXG5pbXBvcnQge0FuaW1hdGlvbkRyaXZlcn0gZnJvbSAnLi9hbmltYXRpb25fZHJpdmVyJztcbmltcG9ydCB7cGFyc2VUaW1lbGluZUNvbW1hbmR9IGZyb20gJy4vc2hhcmVkJztcbmltcG9ydCB7VGltZWxpbmVBbmltYXRpb25FbmdpbmV9IGZyb20gJy4vdGltZWxpbmVfYW5pbWF0aW9uX2VuZ2luZSc7XG5pbXBvcnQge1RyYW5zaXRpb25BbmltYXRpb25FbmdpbmV9IGZyb20gJy4vdHJhbnNpdGlvbl9hbmltYXRpb25fZW5naW5lJztcblxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbkVuZ2luZSB7XG4gIHByaXZhdGUgX3RyYW5zaXRpb25FbmdpbmU6IFRyYW5zaXRpb25BbmltYXRpb25FbmdpbmU7XG4gIHByaXZhdGUgX3RpbWVsaW5lRW5naW5lOiBUaW1lbGluZUFuaW1hdGlvbkVuZ2luZTtcblxuICBwcml2YXRlIF90cmlnZ2VyQ2FjaGU6IHtba2V5OiBzdHJpbmddOiBBbmltYXRpb25UcmlnZ2VyfSA9IHt9O1xuXG4gIC8vIHRoaXMgbWV0aG9kIGlzIGRlc2lnbmVkIHRvIGJlIG92ZXJyaWRkZW4gYnkgdGhlIGNvZGUgdGhhdCB1c2VzIHRoaXMgZW5naW5lXG4gIHB1YmxpYyBvblJlbW92YWxDb21wbGV0ZSA9IChlbGVtZW50OiBhbnksIGNvbnRleHQ6IGFueSkgPT4ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZG9jOiBEb2N1bWVudCxcbiAgICBwcml2YXRlIF9kcml2ZXI6IEFuaW1hdGlvbkRyaXZlcixcbiAgICBwcml2YXRlIF9ub3JtYWxpemVyOiBBbmltYXRpb25TdHlsZU5vcm1hbGl6ZXIsXG4gICkge1xuICAgIHRoaXMuX3RyYW5zaXRpb25FbmdpbmUgPSBuZXcgVHJhbnNpdGlvbkFuaW1hdGlvbkVuZ2luZShkb2MuYm9keSwgX2RyaXZlciwgX25vcm1hbGl6ZXIpO1xuICAgIHRoaXMuX3RpbWVsaW5lRW5naW5lID0gbmV3IFRpbWVsaW5lQW5pbWF0aW9uRW5naW5lKGRvYy5ib2R5LCBfZHJpdmVyLCBfbm9ybWFsaXplcik7XG5cbiAgICB0aGlzLl90cmFuc2l0aW9uRW5naW5lLm9uUmVtb3ZhbENvbXBsZXRlID0gKGVsZW1lbnQ6IGFueSwgY29udGV4dDogYW55KSA9PlxuICAgICAgdGhpcy5vblJlbW92YWxDb21wbGV0ZShlbGVtZW50LCBjb250ZXh0KTtcbiAgfVxuXG4gIHJlZ2lzdGVyVHJpZ2dlcihcbiAgICBjb21wb25lbnRJZDogc3RyaW5nLFxuICAgIG5hbWVzcGFjZUlkOiBzdHJpbmcsXG4gICAgaG9zdEVsZW1lbnQ6IGFueSxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgbWV0YWRhdGE6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YSxcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgY2FjaGVLZXkgPSBjb21wb25lbnRJZCArICctJyArIG5hbWU7XG4gICAgbGV0IHRyaWdnZXIgPSB0aGlzLl90cmlnZ2VyQ2FjaGVbY2FjaGVLZXldO1xuICAgIGlmICghdHJpZ2dlcikge1xuICAgICAgY29uc3QgZXJyb3JzOiBFcnJvcltdID0gW107XG4gICAgICBjb25zdCB3YXJuaW5nczogc3RyaW5nW10gPSBbXTtcbiAgICAgIGNvbnN0IGFzdCA9IGJ1aWxkQW5pbWF0aW9uQXN0KFxuICAgICAgICB0aGlzLl9kcml2ZXIsXG4gICAgICAgIG1ldGFkYXRhIGFzIEFuaW1hdGlvbk1ldGFkYXRhLFxuICAgICAgICBlcnJvcnMsXG4gICAgICAgIHdhcm5pbmdzLFxuICAgICAgKSBhcyBUcmlnZ2VyQXN0O1xuICAgICAgaWYgKGVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgdHJpZ2dlckJ1aWxkRmFpbGVkKG5hbWUsIGVycm9ycyk7XG4gICAgICB9XG4gICAgICBpZiAod2FybmluZ3MubGVuZ3RoKSB7XG4gICAgICAgIHdhcm5UcmlnZ2VyQnVpbGQobmFtZSwgd2FybmluZ3MpO1xuICAgICAgfVxuICAgICAgdHJpZ2dlciA9IGJ1aWxkVHJpZ2dlcihuYW1lLCBhc3QsIHRoaXMuX25vcm1hbGl6ZXIpO1xuICAgICAgdGhpcy5fdHJpZ2dlckNhY2hlW2NhY2hlS2V5XSA9IHRyaWdnZXI7XG4gICAgfVxuICAgIHRoaXMuX3RyYW5zaXRpb25FbmdpbmUucmVnaXN0ZXJUcmlnZ2VyKG5hbWVzcGFjZUlkLCBuYW1lLCB0cmlnZ2VyKTtcbiAgfVxuXG4gIHJlZ2lzdGVyKG5hbWVzcGFjZUlkOiBzdHJpbmcsIGhvc3RFbGVtZW50OiBhbnkpIHtcbiAgICB0aGlzLl90cmFuc2l0aW9uRW5naW5lLnJlZ2lzdGVyKG5hbWVzcGFjZUlkLCBob3N0RWxlbWVudCk7XG4gIH1cblxuICBkZXN0cm95KG5hbWVzcGFjZUlkOiBzdHJpbmcsIGNvbnRleHQ6IGFueSkge1xuICAgIHRoaXMuX3RyYW5zaXRpb25FbmdpbmUuZGVzdHJveShuYW1lc3BhY2VJZCwgY29udGV4dCk7XG4gIH1cblxuICBvbkluc2VydChuYW1lc3BhY2VJZDogc3RyaW5nLCBlbGVtZW50OiBhbnksIHBhcmVudDogYW55LCBpbnNlcnRCZWZvcmU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl90cmFuc2l0aW9uRW5naW5lLmluc2VydE5vZGUobmFtZXNwYWNlSWQsIGVsZW1lbnQsIHBhcmVudCwgaW5zZXJ0QmVmb3JlKTtcbiAgfVxuXG4gIG9uUmVtb3ZlKG5hbWVzcGFjZUlkOiBzdHJpbmcsIGVsZW1lbnQ6IGFueSwgY29udGV4dDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fdHJhbnNpdGlvbkVuZ2luZS5yZW1vdmVOb2RlKG5hbWVzcGFjZUlkLCBlbGVtZW50LCBjb250ZXh0KTtcbiAgfVxuXG4gIGRpc2FibGVBbmltYXRpb25zKGVsZW1lbnQ6IGFueSwgZGlzYWJsZTogYm9vbGVhbikge1xuICAgIHRoaXMuX3RyYW5zaXRpb25FbmdpbmUubWFya0VsZW1lbnRBc0Rpc2FibGVkKGVsZW1lbnQsIGRpc2FibGUpO1xuICB9XG5cbiAgcHJvY2VzcyhuYW1lc3BhY2VJZDogc3RyaW5nLCBlbGVtZW50OiBhbnksIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICBpZiAocHJvcGVydHkuY2hhckF0KDApID09ICdAJykge1xuICAgICAgY29uc3QgW2lkLCBhY3Rpb25dID0gcGFyc2VUaW1lbGluZUNvbW1hbmQocHJvcGVydHkpO1xuICAgICAgY29uc3QgYXJncyA9IHZhbHVlIGFzIGFueVtdO1xuICAgICAgdGhpcy5fdGltZWxpbmVFbmdpbmUuY29tbWFuZChpZCwgZWxlbWVudCwgYWN0aW9uLCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdHJhbnNpdGlvbkVuZ2luZS50cmlnZ2VyKG5hbWVzcGFjZUlkLCBlbGVtZW50LCBwcm9wZXJ0eSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIGxpc3RlbihcbiAgICBuYW1lc3BhY2VJZDogc3RyaW5nLFxuICAgIGVsZW1lbnQ6IGFueSxcbiAgICBldmVudE5hbWU6IHN0cmluZyxcbiAgICBldmVudFBoYXNlOiBzdHJpbmcsXG4gICAgY2FsbGJhY2s6IChldmVudDogYW55KSA9PiBhbnksXG4gICk6ICgpID0+IGFueSB7XG4gICAgLy8gQEBsaXN0ZW5cbiAgICBpZiAoZXZlbnROYW1lLmNoYXJBdCgwKSA9PSAnQCcpIHtcbiAgICAgIGNvbnN0IFtpZCwgYWN0aW9uXSA9IHBhcnNlVGltZWxpbmVDb21tYW5kKGV2ZW50TmFtZSk7XG4gICAgICByZXR1cm4gdGhpcy5fdGltZWxpbmVFbmdpbmUubGlzdGVuKGlkLCBlbGVtZW50LCBhY3Rpb24sIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zaXRpb25FbmdpbmUubGlzdGVuKG5hbWVzcGFjZUlkLCBlbGVtZW50LCBldmVudE5hbWUsIGV2ZW50UGhhc2UsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZsdXNoKG1pY3JvdGFza0lkOiBudW1iZXIgPSAtMSk6IHZvaWQge1xuICAgIHRoaXMuX3RyYW5zaXRpb25FbmdpbmUuZmx1c2gobWljcm90YXNrSWQpO1xuICB9XG5cbiAgZ2V0IHBsYXllcnMoKTogQW5pbWF0aW9uUGxheWVyW10ge1xuICAgIHJldHVybiBbLi4udGhpcy5fdHJhbnNpdGlvbkVuZ2luZS5wbGF5ZXJzLCAuLi50aGlzLl90aW1lbGluZUVuZ2luZS5wbGF5ZXJzXTtcbiAgfVxuXG4gIHdoZW5SZW5kZXJpbmdEb25lKCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuX3RyYW5zaXRpb25FbmdpbmUud2hlblJlbmRlcmluZ0RvbmUoKTtcbiAgfVxuXG4gIGFmdGVyRmx1c2hBbmltYXRpb25zRG9uZShjYjogVm9pZEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5fdHJhbnNpdGlvbkVuZ2luZS5hZnRlckZsdXNoQW5pbWF0aW9uc0RvbmUoY2IpO1xuICB9XG59XG4iXX0=