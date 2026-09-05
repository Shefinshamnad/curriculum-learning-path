from rest_framework import serializers

from .models import Module


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = [
            'id',
            'title',
            'description',
            'tier',
            'prerequisite',
        ]


class SavePathSerializer(serializers.Serializer):
    selected_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=True
    )

    def validate_selected_ids(self, selected_ids):
        selected_ids = list(dict.fromkeys(selected_ids))

        modules = Module.objects.filter(id__in=selected_ids)

        modules_by_id = {
            module.id: module
            for module in modules
        }

        missing_ids = set(selected_ids) - set(modules_by_id.keys())

        if missing_ids:
            raise serializers.ValidationError(
                f'Invalid module IDs: {sorted(missing_ids)}'
            )

        selected_set = set(selected_ids)

        for module in modules:
            if (
                module.prerequisite_id is not None
                and module.prerequisite_id not in selected_set
            ):
                raise serializers.ValidationError(
                    f'"{module.title}" requires its prerequisite '
                    f'(module ID {module.prerequisite_id}) to be selected first.'
                )

        return selected_ids

