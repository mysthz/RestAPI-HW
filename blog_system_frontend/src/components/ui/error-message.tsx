type ErrorMessageProps = {
  message?: string;
};

function ErrorMessage(props: ErrorMessageProps) {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <p className="text-destructive">{props.message || 'Произошла ошибка'}</p>
    </div>
  );
}

export { ErrorMessage };
